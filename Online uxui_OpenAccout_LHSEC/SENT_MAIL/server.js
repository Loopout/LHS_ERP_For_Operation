const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and parse JSON
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/api/send-emails', upload.fields([
    { name: 'excelFile', maxCount: 1 },
    { name: 'attachmentFiles', maxCount: 100 } // Allow up to 100 attachments
]), async (req, res) => {
    try {
        const {
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass,
            smtpSecure,
            subject,
            body
        } = req.body;

        // Basic validation
        if (!req.files['excelFile']) {
            return res.status(400).json({ success: false, message: 'Please upload an Excel file.' });
        }

        const excelFile = req.files['excelFile'][0];
        const attachments = req.files['attachmentFiles'] || [];

        // 1. Read Excel file
        const workbook = xlsx.readFile(excelFile.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON array
        const data = xlsx.utils.sheet_to_json(sheet);
        
        if (data.length === 0) {
            return res.status(400).json({ success: false, message: 'Excel file is empty.' });
        }

        // 2. Setup Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: smtpSecure === 'true', // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // 3. Prepare Base Attachments
        const allAttachments = attachments.map(file => ({
            filename: file.originalname,
            path: file.path
        }));

        // 4. Send Emails
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const row of data) {
            // Try to find email column (case-insensitive)
            let emailKey = Object.keys(row).find(key => {
                const k = key.toLowerCase();
                return (k.includes('email') || k.includes('e-mail') || k.includes('อีเมล') || k.includes('e-statement')) && !k.includes('account');
            });
            
            // If not found by column name, check columns whose value contains an email address
            if (!emailKey) {
                emailKey = Object.keys(row).find(key => {
                    const val = String(row[key] || '').trim();
                    return val.includes('@') && val.includes('.');
                });
            }

            // Fallback to first column
            if (!emailKey) {
                emailKey = Object.keys(row)[0]; 
            }

            const recipientEmail = row[emailKey];

            if (!recipientEmail || !String(recipientEmail).includes('@')) {
                errorCount++;
                errors.push(`Invalid email found at row: ${JSON.stringify(row)}`);
                continue;
            }

            // Map Specific Attachment if specified
            let recipientAttachments = allAttachments;
            let fileNameKey = Object.keys(row).find(key => 
                key.toLowerCase() === 'filename' || 
                key.toLowerCase() === 'attachment' ||
                key.toLowerCase() === 'ไฟล์แนบ'
            );

            if (fileNameKey && row[fileNameKey]) {
                const targetFileNames = String(row[fileNameKey]).split(',').map(s => s.trim().toLowerCase());
                recipientAttachments = allAttachments.filter(att => 
                    targetFileNames.includes(att.filename.toLowerCase())
                );
            }

            // Replace dynamic placeholders in subject and body, e.g. [Account], [CustomerName], [FileName]
            let customizedSubject = subject;
            let customizedBody = body;
            Object.keys(row).forEach(key => {
                const regex = new RegExp(`\\[${key}\\]`, 'gi');
                const val = row[key] !== undefined && row[key] !== null ? row[key] : '';
                customizedSubject = customizedSubject.replace(regex, val);
                customizedBody = customizedBody.replace(regex, val);
            });

            // Send email
            try {
                await transporter.sendMail({
                    from: `"LH Securities" <${smtpUser}>`,
                    to: recipientEmail,
                    subject: customizedSubject,
                    text: customizedBody,
                    html: customizedBody.replace(/\n/g, '<br>'),
                    attachments: recipientAttachments
                });
                successCount++;
            } catch (err) {
                errorCount++;
                errors.push(`Failed to send to ${recipientEmail}: ${err.message}`);
            }
        }

        // 5. Cleanup uploaded files
        fs.unlinkSync(excelFile.path);
        attachments.forEach(file => fs.unlinkSync(file.path));

        res.json({
            success: true,
            message: `Finished sending emails. Success: ${successCount}, Errors: ${errorCount}`,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

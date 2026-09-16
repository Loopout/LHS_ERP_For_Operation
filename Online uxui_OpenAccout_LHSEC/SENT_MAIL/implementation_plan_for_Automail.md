# Connect PDF Splitter to AutoMail Pro Backend

This plan outlines how we will connect the PDF Splitter tool (`split_pdf - MKT.html`) to the `SENT_MAIL` backend to send the E-Document confirmation emails automatically via SMTP instead of opening Outlook.

## Proposed Changes

### 1. Update `SENT_MAIL/server.js`
Currently, `SENT_MAIL` sends *all* uploaded attachments to *every* recipient in the Excel list. Since E-Documents are private per customer, we need to ensure each customer only receives their specific PDF.
- **Increase Attachment Limit:** Increase the `attachmentFiles` limit from 5 to 100 (or more) to support batch sending.
- **Per-Recipient Attachments:** Modify the email sending loop. If the Excel row contains a column like `FileName` or `Attachment`, the server will only attach the specific file that matches that filename. If no such column exists, it will fall back to attaching all files (keeping backward compatibility).

### 2. Move and Update `split_pdf - MKT.html`
- **Move File:** We will move `split_pdf - MKT.html` into the `SENT_MAIL/public/` directory (e.g., as `split_pdf.html`) so it can easily communicate with the backend API on the same domain.
- **Add SMTP Settings UI:** We will add a section to configure SMTP Settings (Host, Port, User, Pass) similar to the main AutoMail Pro UI, so users don't need to hardcode credentials.
- **Integrate SheetJS:** We will include the `xlsx` library via CDN in the PDF Splitter to generate an Excel file in the browser.
- **Automated Sending (`sendAllEmails`):** Instead of generating `mailto:` links, the "Send Email" button will:
  1. Generate an Excel blob containing the list of valid accounts, their emails, and their assigned PDF filenames.
  2. Generate the PDF blobs for each account.
  3. Bundle the Excel blob, PDF blobs, and SMTP settings into a `FormData` object.
  4. Send a single `POST /api/send-emails` request to the backend.
  5. Show a loading spinner and success/error logs upon completion.

### 3. Link the UIs
- Add a navigation link/button in `SENT_MAIL/public/index.html` to open the PDF Splitter.
- Add a back link in the PDF Splitter to return to the main AutoMail Pro interface.

## User Review Required
> [!IMPORTANT]
> - Do you want to keep `split_pdf - MKT.html` as a separate page inside the `SENT_MAIL` app (e.g., accessed via a menu), or should we fully merge them into one single interface?
> - Is the maximum limit of 100 attachments per batch sufficient, or do you need to process more at once?

## Verification Plan
1. Start the `SENT_MAIL` node server.
2. Open the PDF Splitter page, upload a sample PDF.
3. Configure the SMTP settings and email mapping.
4. Click send, verify that the backend receives the request and sends the correct customized PDF to each email address.

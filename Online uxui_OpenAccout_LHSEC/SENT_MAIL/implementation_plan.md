# Auto Email Sender Web Application

Create a web-based application to automate sending emails to a list of recipients defined in an Excel file, with support for file attachments.

## User Review Required

> [!IMPORTANT]  
> Please review the technology stack and requirements below before we proceed.
> 1. **Email Service (SMTP)**: To send emails, we will need an SMTP server (e.g., Gmail, Outlook, or a company SMTP server). You will need to provide the SMTP credentials (Host, Port, Username, Password) in the web interface or via a `.env` file.
> 2. **Project Setup**: We will initialize a Node.js project in the `SENT_MAIL` folder. Does that sound good?

## Open Questions

> [!WARNING]  
> 1. **Excel Format**: What does the Excel file look like? Should we expect a specific column name like `Email` or `Account` to extract the email addresses?
> 2. **Email Body**: Do you want to be able to type a custom email body on the web page, or should it be read from a file/database?
> 3. **Dynamic Content**: Do you need dynamic fields in the email body (e.g., "Dear [Name]", where "Name" comes from the Excel file)?

## Proposed Changes

We will build this using **Node.js (Express)** for the backend and **HTML/CSS/JS** for a beautiful, modern frontend.

### Frontend (UI)
We will create a stunning, modern web interface with the following features:
- A form to input SMTP credentials (if not hardcoded in the backend).
- A drag-and-drop file upload zone for the **Excel file**.
- A drag-and-drop file upload zone for **Email Attachments**.
- Input fields for **Email Subject** and **Email Body**.
- A "Send Emails" button with a progress indicator.

### Backend (Node.js API)
- **`multer`**: For handling file uploads from the frontend to the server.
- **`xlsx`**: For parsing the uploaded Excel file to extract the list of email addresses.
- **`nodemailer`**: For connecting to the SMTP server and dispatching the emails with attachments.

### Implementation Steps
1. Initialize the Node.js project (`npm init`) in the `SENT_MAIL` folder.
2. Install dependencies (`express`, `multer`, `xlsx`, `nodemailer`, `cors`, `dotenv`).
3. Create the Backend Server (`server.js`) with an API endpoint to handle the form submission.
4. Create the Frontend UI (`public/index.html`, `public/style.css`, `public/script.js`) with a premium design.
5. Implement the logic to parse the Excel file, iterate over the emails, and send them using `nodemailer`.

## Verification Plan

### Manual Verification
- Start the server using `node server.js`.
- Open the web application in a browser.
- Upload a test Excel file with a few test email addresses.
- Attach a test file.
- Send the email and verify that the test accounts receive the email with the correct subject, body, and attachment.

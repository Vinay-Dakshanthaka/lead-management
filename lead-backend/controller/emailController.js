const Queue = require("bull");
const nodemailer = require('nodemailer');
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx"); 
const db = require('../models')
const { v4: uuidv4 } = require("uuid");

// const emailQueue = new Queue("emailQueue");

const EmailStatus = db.EmailStatus;
let transporter;

function createTransporter(senderEmail) {
   

    // Check which sender email and configure accordingly
    if (senderEmail === "info@totfd.fun") {
        transporter = {
            host: "mail.totfd.fun",
            port: 587,
            secure: false, // false for STARTTLS (only true for port 465)
            auth: {
                user: "info@totfd.fun",
                pass: "Vinay@4499" // password for info@totfd.fun
            },
            tls: {
                rejectUnauthorized: false // Optional (use if you have SSL certificate issues)
            }
        };
    } else if (senderEmail === "info@totfd.in") {
        transporter = {
            host: "mail.totfd.fun", // Same host for both, only different credentials
            port: 587,
            secure: false, // false for STARTTLS (only true for port 465)
            auth: {
                user: "info@totfd.in",
                pass: "Vinay@4499" // password for info@totfd.in
            },
            tls: {
                rejectUnauthorized: false // Optional (use if you have SSL certificate issues)
            }
        };
    } else {
        throw new Error("Unsupported sender email.");
    }

    return nodemailer.createTransport(transporter);
}



// transporter.verify((error, success) => {
//     if (error) {
//         console.error("Email transporter configuration error:", error);
//     } else {
//         console.log("Email transporter is ready to send messages!");
//     }
// });

// Function to send an email
const sendTestEmail = async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        
        // Define email options
        const mailOptions = {
            from: "info@totfd.fun",
            to,
            subject,
            text
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email", error });
    }
};

// Configure Multer for File Uploads (Temporary Storage)
const upload = multer({
    dest: "uploads/", // Temporary storage location
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

const sendBulkEmails = async (req, res) => {
    const failedEmails = []; // Store failed email addresses

    try {
        const { from, to, subject, text } = req.body;
        const files = req.files; // Get uploaded files

        if (!from || !to || !subject || !text) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Ensure 'to' is an array of emails
        const recipientList = Array.isArray(to) ? to : [to];

        // Prepare attachments
        const attachments = files.map((file) => ({
            filename: file.originalname,
            path: file.path, // File location in 'uploads/' directory
        }));

        // Function to validate email format
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        console.log("email : , :, ",email);
        // Track success count
        let successCount = 0;

        // Loop through each recipient and send an email
        for (const email of recipientList) {
            if (!isValidEmail(email)) {
                console.warn(`Skipping invalid email: ${email}`);
                failedEmails.push({ email, error: "Invalid email format" });
                continue; 
            }

            try {
                // Define email options
                const mailOptions = {
                    from,
                    to: email,
                    subject,
                    text,
                    attachments,
                };

                // Send email to the current recipient
                await transporter.sendMail(mailOptions);
                successCount++; // Increment success count
            } catch (error) {
                console.log("Error sending mails in sendBulkEmails : ", error)
                console.error(`Error sending email to ${email}:`, error.message);
                failedEmails.push({ email, error: error.message });
            }
        }

        // Delete temporary files after sending to all recipients
        attachments.forEach((attachment) => {
            fs.unlink(attachment.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        });

        // Return response with success and failure details
        return res.status(200).json({
            message: `${successCount} emails sent successfully.`,
            failedEmails,
        });

    } catch (error) {
        console.error("Error in bulk email sending:", error);
        return res.status(500).json({ message: "Failed to send emails", error: error.message });
    }
};

const sendBulkEmailsIndividually = async (req, res) => {
    const failedEmails = [];
    let successCount = 0;

    try {
        const { from, to, subject, text } = req.body;
        const files = req.files || [];

        console.log("Received fields ", from, " : ", to, " : ", subject, " : ", text);

        if (!from || !to || !subject || !text) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Ensure 'to' is an array of emails
        const recipientList = Array.isArray(to) ? to : [to];

        // Function to validate email format
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Prepare attachments (if any)
        const attachments = files.map((file) => ({
            filename: file.originalname,
            path: file.path,
        }));

        // Send emails one by one
        for (const email of recipientList) {
            if (!isValidEmail(email)) {
                console.warn(`Skipping invalid email: ${email}`);
                failedEmails.push({ email, error: "Invalid email format" });
                continue;
            }

            // Check if the sender email matches allowed options and configure dynamically
            if (from !== "info@totfd.fun" && from !== "info@totfd.in") {
                failedEmails.push({ email, error: "Unsupported sender email" });
                continue; // Skip unsupported sender
            }

            try {
                const transporter = createTransporter(from); // Dynamically configure the transporter

                const mailOptions = {
                    from, // Use the 'from' email received in the body
                    to: email,
                    subject,
                    text,
                    attachments,
                };

                await transporter.sendMail(mailOptions);
                successCount++;
                console.log("Mail sent successfully from:", from, "to:", email);
            } catch (error) {
                console.log("Error sending mail:", error);
                console.error(`Error sending email to ${email}:`, error.message);
                failedEmails.push({ email, error: error.message });
            }
        }

        // Clean up temp files after emails are sent
        for (const file of attachments) {
            fs.unlink(file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }

        return res.status(200).json({
            message: `${successCount} emails sent successfully.`,
            failedEmails,
        });

    } catch (error) {
        console.error("Error in bulk email sending:", error);
        return res.status(500).json({ message: "Failed to send emails", error: error.message });
    }
};

// =====================================
// const sendBulkEmailsFromExcel = async (req, res) => {
//     const failedEmails = [];
//     let successCount = 0;

//     try {
//         const { from, subject, text } = req.body;
//         const files = req.files; // All uploaded files

//         if (!from || !subject || !text || !files || files.length === 0) {
//             return res.status(400).json({ message: "Missing required fields or file." });
//         }

//         // Identify Excel file
//         const excelFile = files.find(file => file.mimetype.includes("spreadsheet"));
//         if (!excelFile) {
//             return res.status(400).json({ message: "Please upload an Excel file (.xlsx or .xls)" });
//         }

//         // Read and parse the Excel file
//         const workbook = xlsx.readFile(excelFile.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(worksheet);

//         if (!data || data.length === 0 || !data[0].Email) {
//             return res.status(400).json({ message: "Excel file must contain an 'Email' column." });
//         }

//         // Validate emails
//         const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//         const recipientList = data
//             .map(row => row.Email)
//             .filter(email => isValidEmail(email));

//         if (recipientList.length === 0) {
//             return res.status(400).json({ message: "No valid emails found in the Excel file." });
//         }

//         // Prepare attachments (excluding the Excel file itself)
//         const attachments = files
//             .filter(file => !file.mimetype.includes("spreadsheet"))
//             .map(file => ({
//                 filename: file.originalname,
//                 path: file.path,
//             }));

//         // Send emails
//         for (const email of recipientList) {
//             try {
//                 await transporter.sendMail({ from, to: email, subject, text, attachments });
//                 successCount++;
//             } catch (error) {
//                 failedEmails.push({ email, error: error.message });
//             }
//         }

//         // Cleanup uploaded files
//         const deleteFile = async (filePath) => {
//             try {
//                 await fs.promises.unlink(filePath);
//             } catch (err) {
//                 console.error("Failed to delete file:", filePath, err.message);
//             }
//         };

//         await Promise.all([deleteFile(excelFile.path), ...attachments.map(file => deleteFile(file.path))]);

//         return res.status(200).json({
//             message: `${successCount} emails sent successfully.`,
//             failedEmails,
//         });

//     } catch (error) {
//         console.error("Error sending bulk emails from Excel:", error);
//         return res.status(500).json({ message: "Failed to send emails", error: error.message });
//     }
// };


// ====================


const emailQueue = {};

// Send Bulk Emails from Excel
const sendBulkEmailsFromExcel = async (req, res) => {
    try {
        const { from, subject, text } = req.body;
        const files = req.files;

        if (!from || !subject || !text || !files || files.length === 0) {
            return res.status(400).json({ message: "Missing required fields or file." });
        }

        const excelFile = files.find((file) => file.mimetype.includes("spreadsheet"));
        if (!excelFile) {
            return res.status(400).json({ message: "Please upload an Excel file (.xlsx or .xls)." });
        }

        const workbook = xlsx.readFile(excelFile.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        if (!data || data.length === 0 || !data[0].Email) {
            return res.status(400).json({ message: "Excel file must contain an 'Email' column." });
        }

        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const recipientList = data.map((row) => row.Email).filter((email) => isValidEmail(email));

        if (recipientList.length === 0) {
            return res.status(400).json({ message: "No valid emails found in the Excel file." });
        }

        const taskId = uuidv4();
        emailQueue[taskId] = {
            totalEmails: recipientList.length,
            sentEmails: 0,
            failedEmails: 0,
            status: "IN_PROGRESS",
        };

        const attachments = files
            .filter((file) => !file.mimetype.includes("spreadsheet"))
            .map((file) => ({ filename: file.originalname, path: file.path }));

        for (const email of recipientList) {
            await EmailStatus.create({ email, subject, status: "PENDING", taskId });
        }

        // Start email processing
        processEmails(taskId, recipientList, from, subject, text, attachments);

        await fs.promises.unlink(excelFile.path);
        await Promise.all(attachments.map((file) => fs.promises.unlink(file.path)));

        return res.status(202).json({
            message: "Emails are being sent in the background.",
            taskId,
        });
    } catch (error) {
        console.error("Error sending bulk emails:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

const sendEmailsIndividually = async (req, res) => {
    try {
        const { from, subject, text, to } = req.body;
        const files = req.files || [];

        // Validate required fields
        if (!from || !subject || !text || !to || !Array.isArray(to) || to.length === 0) {
            return res.status(400).json({ message: "Missing required fields or invalid email list." });
        }

        // Function to validate email format
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        // Filter out invalid emails from the recipient list
        const recipientList = to.filter((email) => isValidEmail(email));

        if (recipientList.length === 0) {
            return res.status(400).json({ message: "No valid emails found in the provided list." });
        }

        // Prepare attachments if any
        const attachments = files.map((file) => ({ filename: file.originalname, path: file.path }));

        // Generate a unique task ID for tracking
        const taskId = uuidv4();

        // Store the email task status in the queue (initially as IN_PROGRESS)
        emailQueue[taskId] = {
            totalEmails: recipientList.length,
            sentEmails: 0,
            failedEmails: 0,
            status: "IN_PROGRESS",
        };

        // Log the initial status of each email as PENDING in the database or system
        for (const email of recipientList) {
            await EmailStatus.create({ email, subject, status: "PENDING", taskId });
        }

        // Start email processing asynchronously
        processEmails(taskId, recipientList, from, subject, text, attachments);

        // Clean up temporary attachment files
        await Promise.all(attachments.map((file) => fs.promises.unlink(file.path)));

        // Return a response with the task ID and a message that emails are being sent
        return res.status(202).json({
            message: "Emails are being sent in the background.",
            taskId,
        });
    } catch (error) {
        console.error("Error sending emails individually:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};


// Process Emails in Chunks
const processEmails = async (taskId, recipientList, from, subject, text, attachments) => {
    const BATCH_SIZE = 50; // Number of emails per batch
    const MAX_EMAILS_PER_MINUTE = 30; // Max emails to send per minute (adjust this value)
    const WARM_UP_DAYS = 7; // Number of days to gradually warm up the email domain
    let index = 0;

    // Throttle function to delay email sending between batches to avoid rate-limiting
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Function to gradually increase the sending volume based on warm-up strategy
    const warmUpStrategy = (day) => {
        // Increase the volume of emails each day, e.g., start with 20 emails on the first day and gradually increase
        // The number can be adjusted based on your strategy
        return Math.min(MAX_EMAILS_PER_MINUTE * day, 100); // Ensure we don’t exceed the max emails limit
    };

    // Function to process a batch of emails
    const processBatch = async () => {
        if (index >= recipientList.length) {
            emailQueue[taskId].status = "COMPLETED";
            return;
        }

        const batch = recipientList.slice(index, index + BATCH_SIZE);
        index += BATCH_SIZE;

        const transporter = createTransporter(from);

        // Process emails individually within the batch
        await Promise.all(
            batch.map(async (email) => {
                try {
                    // Validate email format
                    if (!isValidEmail(email)) {
                        console.warn(`Skipping invalid email: ${email}`);
                        await EmailStatus.update({ status: "FAILED", error_message: "Invalid email format" }, { where: { email, taskId } });
                        emailQueue[taskId].failedEmails++;
                        return;
                    }

                    const mailOptions = {
                        from,        // Sender email (from request body)
                        to: email,   // Recipient email
                        subject,     // Subject of the email
                        text,        // Text body of the email
                        attachments, // Attachments array (if any)
                    };

                    // Send the email using the transporter
                    await transporter.sendMail(mailOptions);

                    // Update status in the database
                    await EmailStatus.update({ status: "SENT" }, { where: { email, taskId } });
                    emailQueue[taskId].sentEmails++;
                    console.log(`Email sent successfully to: ${email}`);
                } catch (error) {
                    // Handle any errors during email sending
                    console.error(`Error sending email to ${email}:`, error.message);
                    await EmailStatus.update(
                        { status: "FAILED", error_message: error.message },
                        { where: { email, taskId } }
                    );
                    emailQueue[taskId].failedEmails++;
                }
            })
        );

        // Wait for the throttle duration before sending the next batch (limit the frequency)
        const day = Math.ceil(emailQueue[taskId].sentEmails / MAX_EMAILS_PER_MINUTE);
        const maxEmailsToday = warmUpStrategy(day);
        const waitTime = (60 / maxEmailsToday) * 1000; // Time to wait before sending the next batch (in ms)

        // Continue processing the next batch with delay to avoid overloading the server
        await delay(waitTime);
        setImmediate(processBatch);
    };

    // Start processing the first batch
    processBatch();
};

// Utility function to validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// API to Get Email Sending Progress
const getEmailSendingProgress = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId || !emailQueue[taskId]) {
            return res.status(404).json({ message: "Task not found." });
        }

        const { totalEmails, sentEmails, failedEmails, status } = emailQueue[taskId];
        const progress = Math.round((sentEmails / totalEmails) * 100);

        return res.status(200).json({
            taskId,
            totalEmails,
            sentEmails,
            failedEmails,
            progress,
            status,
        });
    } catch (error) {
        console.error("Error fetching email progress:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};



// ------------------------------Experiment---------------------------//


// Queue processor





// emailQueue.process(async (job) => {
//     const { email, from, subject, text, attachments } = job.data;

//     try {
//         const response = await transporter.sendMail({
//             from,
//             to: email,
//             subject,
//             text,
//             attachments,
//         });

//         // Store success status in the database
//         await EmailStatus.create({
//             email,
//             subject,
//             status: "SUCCESS",
//             response: response,
//         });
//     } catch (error) {
//         // Store failure status in the database
//         await EmailStatus.create({
//             email,
//             subject,
//             status: "FAILED",
//             error_message: error.message,
//         });
//     }
// });

// const sendBulkEmailsFromExcel = async (req, res) => {
//     try {
//         const { from, subject, text } = req.body;
//         const files = req.files;

//         if (!from || !subject || !text || !files || files.length === 0) {
//             return res.status(400).json({ message: "Missing required fields or file." });
//         }

//         // Identify and read the Excel file
//         const excelFile = files.find((file) => file.mimetype.includes("spreadsheet"));
//         if (!excelFile) {
//             return res.status(400).json({ message: "Please upload an Excel file (.xlsx or .xls)." });
//         }

//         const workbook = xlsx.readFile(excelFile.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(worksheet);

//         if (!data || data.length === 0 || !data[0].Email) {
//             return res.status(400).json({ message: "Excel file must contain an 'Email' column." });
//         }

//         // Validate and extract recipient emails
//         const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//         const recipientList = data
//             .map((row) => row.Email)
//             .filter((email) => isValidEmail(email));

//         if (recipientList.length === 0) {
//             return res.status(400).json({ message: "No valid emails found in the Excel file." });
//         }

//         // Prepare attachments
//         const attachments = files
//             .filter((file) => !file.mimetype.includes("spreadsheet"))
//             .map((file) => ({
//                 filename: file.originalname,
//                 path: file.path,
//             }));

//         // Queue emails for processing
//         for (const email of recipientList) {
//             emailQueue.add({
//                 email,
//                 from,
//                 subject,
//                 text,
//                 attachments,
//             });
//         }

//         // Cleanup uploaded files
//         const deleteFile = async (filePath) => {
//             try {
//                 await fs.promises.unlink(filePath);
//             } catch (err) {
//                 console.error("Failed to delete file:", filePath, err.message);
//             }
//         };
//         await Promise.all([
//             deleteFile(excelFile.path),
//             ...attachments.map((file) => deleteFile(file.path)),
//         ]);

//         return res.status(200).json({
//             message: "Emails have been queued for sending. Check status in the EmailStatus table.",
//         });
//     } catch (error) {
//         console.error("Error in bulk email sending:", error);
//         return res.status(500).json({ message: "Internal server error.", error: error.message });
//     }
// };

// const getEmailSendingProgress = async (req, res) => {
//     try {
//         const { taskId } = req.params;

//         if (!taskId) {
//             return res.status(400).json({ message: "Task ID is required." });
//         }

//         // Query EmailStatus table for progress
//         const totalEmails = await EmailStatus.count({
//             where: { taskId },
//         });

//         const sentEmails = await EmailStatus.count({
//             where: {
//                 taskId,
//                 status: "SENT",
//             },
//         });

//         const failedEmails = await EmailStatus.count({
//             where: {
//                 taskId,
//                 status: "FAILED",
//             },
//         });

//         // Calculate progress percentage
//         const progress = totalEmails > 0 ? Math.round((sentEmails / totalEmails) * 100) : 0;

//         return res.status(200).json({
//             taskId,
//             totalEmails,
//             sentEmails,
//             failedEmails,
//             progress,
//         });
//     } catch (error) {
//         console.error("Error fetching email progress:", error.message);
//         return res.status(500).json({ message: "Internal server error." });
//     }
// };


// Queue Processor for sending emails

// emailQueue.process(async (job) => {
//     console.log("Processing job:", job.data);
//     const { email, from, subject, text, attachments, taskId } = job.data;

//     try {
//         const response = await transporter.sendMail({
//             from,
//             to: email,
//             subject,
//             text,
//             attachments,
//         });

//         // Store success status in the database
//         await EmailStatus.create({
//             email,
//             subject,
//             status: "SENT",
//             taskId,
//             response: JSON.stringify(response),
//         });
//     } catch (error) {
//         // Store failure status in the database
//         await EmailStatus.create({
//             email,
//             subject,
//             status: "FAILED",
//             taskId,
//             error_message: error.message,
//         });
//     }
// });

// Controller Method: Send Bulk Emails from Excel
// const sendBulkEmailsFromExcel = async (req, res) => {
//     try {
//         const { from, subject, text } = req.body;
//         const files = req.files;

//         if (!from || !subject || !text || !files || files.length === 0) {
//             return res.status(400).json({ message: "Missing required fields or file." });
//         }

//         const excelFile = files.find((file) => file.mimetype.includes("spreadsheet"));
//         if (!excelFile) {
//             return res.status(400).json({ message: "Please upload an Excel file (.xlsx or .xls)." });
//         }

//         const workbook = xlsx.readFile(excelFile.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(worksheet);

//         if (!data || data.length === 0 || !data[0].Email) {
//             return res.status(400).json({ message: "Excel file must contain an 'Email' column." });
//         }

//         const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//         const recipientList = data
//             .map((row) => row.Email)
//             .filter((email) => isValidEmail(email));

//         if (recipientList.length === 0) {
//             return res.status(400).json({ message: "No valid emails found in the Excel file." });
//         }

//         const taskId = `task-${Date.now()}`;
//         const attachments = files
//             .filter((file) => !file.mimetype.includes("spreadsheet"))
//             .map((file) => ({
//                 filename: file.originalname,
//                 path: file.path,
//             }));

//         for (const email of recipientList) {
//             emailQueue.add({
//                 email,
//                 from,
//                 subject,
//                 text,
//                 attachments,
//                 taskId,
//             });
//         }

//         const deleteFile = async (filePath) => {
//             try {
//                 await fs.promises.unlink(filePath);
//             } catch (err) {
//                 console.error("Failed to delete file:", filePath, err.message);
//             }
//         };
//         await Promise.all([deleteFile(excelFile.path), ...attachments.map((file) => deleteFile(file.path))]);

//         return res.status(200).json({
//             message: "Emails have been queued for sending. Use the taskId to track progress.",
//             taskId,
//         });
//     } catch (error) {
//         console.error("Error in bulk email sending:", error);
//         return res.status(500).json({ message: "Internal server error.", error: error.message });
//     }
// };

// const sendBulkEmailsFromExcel = async (req, res) => {
//     try {
//         const { from, subject, text } = req.body;
//         const files = req.files;

//         if (!from || !subject || !text || !files || files.length === 0) {
//             return res.status(400).json({ message: "Missing required fields or file." });
//         }

//         const excelFile = files.find((file) => file.mimetype.includes("spreadsheet"));
//         if (!excelFile) {
//             return res.status(400).json({ message: "Upload an Excel file (.xlsx or .xls)." });
//         }

//         const workbook = xlsx.readFile(excelFile.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(worksheet);

//         if (!data || data.length === 0 || !data[0].Email) {
//             return res.status(400).json({ message: "Excel file must have an 'Email' column." });
//         }

//         const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//         const recipientList = data
//             .map((row) => row.Email)
//             .filter((email) => isValidEmail(email));

//         if (recipientList.length === 0) {
//             return res.status(400).json({ message: "No valid emails found in the Excel file." });
//         }

//         const taskId = `task-${Date.now()}`;
//         const attachments = files
//             .filter((file) => !file.mimetype.includes("spreadsheet"))
//             .map((file) => ({ filename: file.originalname, path: file.path }));

//         for (const email of recipientList) {
//             emailQueue.add({
//                 email,
//                 from,
//                 subject,
//                 text,
//                 attachments,
//                 taskId,
//             });
//         }

//         const deleteFile = async (filePath) => {
//             try {
//                 await fs.promises.unlink(filePath);
//             } catch (err) {
//                 console.error("Failed to delete file:", filePath, err.message);
//             }
//         };
//         await Promise.all([deleteFile(excelFile.path), ...attachments.map((file) => deleteFile(file.path))]);

//         return res.status(200).json({
//             message: "Emails have been queued. Use taskId to track progress.",
//             taskId,
//         });
//     } catch (error) {
//         console.error("Error in bulk email sending:", error);
//         return res.status(500).json({ message: "Internal server error.", error: error.message });
//     }
// };

// Controller Method: Get Email Sending Progress
// const getEmailSendingProgress = async (req, res) => {
//     try {
//         const { taskId } = req.params;

//         if (!taskId) {
//             return res.status(400).json({ message: "Task ID is required." });
//         }

//         const totalEmails = await EmailStatus.count({ where: { taskId } });
//         const sentEmails = await EmailStatus.count({ where: { taskId, status: "SENT" } });
//         const failedEmails = await EmailStatus.count({ where: { taskId, status: "FAILED" } });

//         const progress = totalEmails > 0 ? Math.round((sentEmails / totalEmails) * 100) : 0;

//         return res.status(200).json({
//             taskId,
//             totalEmails,
//             sentEmails,
//             failedEmails,
//             progress,
//         });
//     } catch (error) {
//         console.error("Error fetching email progress:", error.message);
//         return res.status(500).json({ message: "Internal server error." });
//     }
// };

// const getEmailSendingProgress = async (req, res) => {
//     try {
//         const { taskId } = req.params;
//         if (!taskId) return res.status(400).json({ message: "Task ID is required." });

//         const totalEmails = await EmailStatus.count({ where: { taskId } });
//         const sentEmails = await EmailStatus.count({ where: { taskId, status: "SENT" } });
//         const failedEmails = await EmailStatus.count({ where: { taskId, status: "FAILED" } });

//         const progress = totalEmails > 0 ? Math.round((sentEmails / totalEmails) * 100) : 0;

//         return res.status(200).json({
//             taskId,
//             totalEmails,
//             sentEmails,
//             failedEmails,
//             progress,
//         });
//     } catch (error) {
//         console.error("Error fetching email progress:", error.message);
//         return res.status(500).json({ message: "Internal server error." });
//     }
// };


module.exports = { sendTestEmail, sendBulkEmails, upload, sendBulkEmailsFromExcel, sendBulkEmailsIndividually,
    getEmailSendingProgress, sendEmailsIndividually
 };

const express = require('express')
const emailController = require('../controller/emailController')
const emailRouter = express.Router();

emailRouter.post('/send-email', emailController.sendTestEmail);
emailRouter.post('/send-bulk-email',emailController.upload.array("files",5),  emailController.sendBulkEmails);

emailRouter.post('/send-bulk-email-individual',emailController.upload.array("files",5),  emailController.sendBulkEmailsIndividually);

emailRouter.post('/send-bulk-email-excel',emailController.upload.array("files",5),  emailController.sendBulkEmailsFromExcel);

emailRouter.get("/progress/:taskId", emailController.getEmailSendingProgress);


module.exports = emailRouter;
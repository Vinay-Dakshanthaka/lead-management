const { Queue, Worker } = require("bullmq");
const transporter = require("../utils/emailTransporter");
const EmailStatus = require("../models/emailStatus");
const Redis = require("ioredis");

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

const emailQueue = new Queue("emailQueue", { connection });

const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        console.log("📩 Processing job:", job.data);
        const { email, from, subject, text, attachments, taskId } = job.data;

        try {
            const response = await transporter.sendMail({
                from,
                to: email,
                subject,
                text,
                attachments,
            });

            await EmailStatus.create({
                email,
                subject,
                status: "SENT",
                taskId,
                response: JSON.stringify(response),
            });

            console.log(`✅ Email sent to ${email}`);
        } catch (error) {
            await EmailStatus.create({
                email,
                subject,
                status: "FAILED",
                taskId,
                error_message: error.message,
            });

            console.error(`❌ Email failed to ${email}:`, error.message);
        }
    },
    { connection }
);

module.exports = emailQueue;

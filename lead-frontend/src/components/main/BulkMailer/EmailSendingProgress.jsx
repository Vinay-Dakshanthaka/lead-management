import React, { useState, useEffect } from "react";
import { getEmailSendingProgress } from "../emailSender/emailService";

const EmailSendingProgress = ({ taskId }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("in_progress");
    const [failedEmails, setFailedEmails] = useState([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await getEmailSendingProgress(taskId);
                setProgress(response.data.progress);
                setStatus(response.data.status);
                setFailedEmails(response.data.failedEmails);
                if (response.data.status === "completed") {
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Error fetching progress:", error.message);
                clearInterval(interval);
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [taskId]);

    return (
        <div className="mt-4">
            <h3>Email Sending Progress</h3>
            <p>Progress: {progress}%</p>
            {status === "completed" && (
                <p className="text-green-500">Email sending completed!</p>
            )}
            {status === "in_progress" && (
                <p className="text-yellow-500">Emails are being sent...</p>
            )}
            {failedEmails.length > 0 && (
                <div className="mt-2">
                    <h4>Failed Emails:</h4>
                    <ul>
                        {failedEmails.map((email, index) => (
                            <li key={index}>{email}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EmailSendingProgress;

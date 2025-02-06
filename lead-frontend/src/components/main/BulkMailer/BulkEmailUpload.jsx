import React, { useState } from "react";
import EmailSendingProgress from "./EmailSendingProgress";
import { sendBulkEmailsIndividually } from "../emailSender/emailService";

const BulkEmailUpload = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [taskId, setTaskId] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please upload a valid Excel file.");
            return;
        }
        setIsUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await sendBulkEmailsIndividually(formData);
            setTaskId(response.data.taskId); // Store the task ID for tracking progress
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
            <input type="file" onChange={handleFileChange} />
            <button
                className="btn btn-primary mt-2"
                onClick={handleUpload}
                disabled={isUploading}
            >
                {isUploading ? "Uploading..." : "Upload and Start"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {taskId && <EmailSendingProgress taskId={taskId} />}
        </div>
    );
};

export default BulkEmailUpload;

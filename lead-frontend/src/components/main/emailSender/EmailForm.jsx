import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";

const EmailForm = ({ onSubmit, isSending }) => {
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        subject: "",
        text: "",
        files: [],
        excelFile: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (acceptedFiles) => {
        setFormData((prev) => ({
            ...prev,
            files: acceptedFiles,
        }));
    };

    const handleExcelChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            excelFile: e.target.files[0],
            to: "", // Reset 'To' field when Excel is uploaded
        }));
    };
    const handleToFieldChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            to: e.target.value,
            excelFile: null, // Reset Excel when 'To' is entered
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Ensure the 'to' field is populated or an Excel file is uploaded
        if (!formData.from || (!formData.to && !formData.excelFile) || !formData.subject || !formData.text) {
            alert("Please fill in all fields or upload an Excel file.");
            return;
        }
    
        const data = new FormData();
        data.append("from", formData.from);
        data.append("subject", formData.subject);
        data.append("text", formData.text);
    
        // If an Excel file is uploaded, append it to the form data
        if (formData.excelFile) {
            data.append("files", formData.excelFile);
        }
        // Attach other files (including attachments)
        formData.files.forEach((file) => data.append("files", file));
    
        // Check if 'to' field is filled out
        if (formData.to) {
            // Split the 'to' field by commas and remove any extra spaces
            const emails = formData.to.split(",").map(email => email.trim());
    
            // Create a new FormData entry for the emails
            data.append("to", JSON.stringify(emails)); // Send 'to' as an array of emails
        }
    
        // Pass data to the onSubmit function
        onSubmit(data, formData.excelFile ? "excel" : "manual");
    };
    
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleFileChange,
        accept: ".pdf,.png,.jpg,.jpeg,.docx,.xls,.xlsx,.txt",
        multiple: true,
        maxSize: 10 * 1024 * 1024,
    });

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
                <label htmlFor="from" className="form-label">From</label>
                <input
                    type="email"
                    id="from"
                    name="from"
                    className="form-control"
                    value={formData.from}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* "To" Field (Disabled if Excel is Uploaded) */}
            <div className="mb-3">
                <label htmlFor="to" className="form-label">To (Comma Separated Emails)</label>
                <input
                    type="text"
                    id="to"
                    name="to"
                    className="form-control"
                    value={formData.to}
                    onChange={handleToFieldChange}
                    disabled={!!formData.excelFile}
                />
                <small className="text-muted">Enter multiple emails separated by commas.</small>
            </div>

            {/* Excel Upload (Always Visible Below "To" Field) */}
            <div className="mb-3">
                <label className="form-label">Upload Excel File (Emails List)</label>
                <input
                    type="file"
                    className="form-control"
                    accept=".xls,.xlsx"
                    onChange={handleExcelChange}
                    disabled={!!formData.to}
                />
                {formData.excelFile && <p className="mt-2 text-success">{formData.excelFile.name}</p>}
            </div>

            {/* Subject Field */}
            <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="form-control"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Email Body */}
            <div className="mb-3">
                <label htmlFor="text" className="form-label">Text</label>
                <textarea
                    id="text"
                    name="text"
                    className="form-control"
                    rows="4"
                    value={formData.text}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>

            {/* Attachments (Always Visible) */}
            <div className="mb-3">
                <label className="form-label">Attachments</label>
                <div {...getRootProps()} className="dropzone p-3 border">
                    <input {...getInputProps()} />
                    <p>Drag and drop files here, or click to select files (Max 10MB)</p>
                </div>
                <div className="mt-2">
                    {formData.files.map((file, index) => (
                        <span key={index} className="badge bg-secondary me-2">{file.name}</span>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSending}>
                {isSending ? "Sending..." : "Send Emails"}
            </button>
        </form>
    );
};

export default EmailForm;
            

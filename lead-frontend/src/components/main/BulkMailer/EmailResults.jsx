import React from "react";

const EmailResults = ({ successCount, failedEmails }) => {
    return (
        <div className="mt-4">
            <h2>Email Results</h2>
            <p>Successful Emails: {successCount}</p>
            {failedEmails.length > 0 && (
                <div>
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

export default EmailResults;

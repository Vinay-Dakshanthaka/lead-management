import React from "react";

const StatusList = ({ statusList }) => {
    return (
        <div className="mt-5">
            <h5>Email Send Status</h5>
            {statusList.length > 0 ? (
                <ul className="list-group">
                    {statusList.map((status, index) => (
                        <li
                            key={index}
                            className={`list-group-item ${
                                status.error ? "list-group-item-danger" : "list-group-item-success"
                            }`}
                        >
                            <strong>{status.email}</strong>
                            <p>{status.error || "Email sent successfully!"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No status available yet.</p>
            )}
        </div>
    );
};

export default StatusList;

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL } from "../../config";
import whatsAppQRCode from "./whatsApp_QR_Code.png";
import laraLogo from "./laralogoPNG.png";

const InterestedLeadsForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        place: "",
    });

    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseURL}/api/interestedLeadsWhatsApp/interested-leads`,
                formData
            );

            if (response.status === 201) {
                toast.success("Thank you! We will contact you soon.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    college: "",
                    place: "",
                });
                setIsSubmitted(true); // Update the submission state
            }
        } catch (error) {
            if (error && error.status === 409) {
                toast.success("Thank you! We will contact you soon");
                setIsSubmitted(true); // Update the submission state
            } else {
                console.error("Error while saving lead data: ", error);
                toast.error(error.message || "Failed to save your details. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-lg">
                        <div className="card-header bg-warning text-white text-center">
                            <div className="d-flex justify-content-center align-items-center">
                                <img src={laraLogo} alt="Lara Logo" style={{ height: "50px" }} />
                                <h4 className="ms-3 mb-0">Lara Technologies</h4>
                            </div>
                        </div>
                        <div className="card-body">
                            {isSubmitted ? (
                                // QR Code Section
                                <div className="text-center">
                                    <img
                                        src={whatsAppQRCode}
                                        alt="WhatsApp QR Code"
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxHeight: "300px" }}
                                    />
                                    <p className="mt-3">
                                        Scan the QR code to connect with us on WhatsApp or click the link below to join our channel!
                                    </p>
                                    <a
                                        href="https://whatsapp.com/channel/0029Var9Wub30LKJP7fK7y06"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success mt-2"
                                        style={{
                                            textDecoration: "none",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Join Our WhatsApp Channel
                                    </a>
                                </div>
                            ) : (
                                // Form Section
                                <>
                                    <h5 className="text-center mb-4">
                                        Please fill the form. We will get back to you soon!
                                    </h5>
                                    <form onSubmit={handleSubmit}>
                                        {[
                                            { label: "Name (Required)", name: "name", type: "text", required: true },
                                            { label: "Phone (Required)", name: "phone", type: "text", required: true },
                                            { label: "Email", name: "email", type: "email", required: false },
                                            { label: "College", name: "college", type: "text", required: false },
                                            { label: "Place", name: "place", type: "text", required: false },
                                        ].map(({ label, name, type, required }) => (
                                            <div className="mb-3" key={name}>
                                                <label htmlFor={name} className="form-label">
                                                    {label}
                                                </label>
                                                <input
                                                    type={type}
                                                    className="form-control"
                                                    id={name}
                                                    name={name}
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                    required={required}
                                                />
                                            </div>
                                        ))}
                                        <div className="d-grid">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestedLeadsForm;

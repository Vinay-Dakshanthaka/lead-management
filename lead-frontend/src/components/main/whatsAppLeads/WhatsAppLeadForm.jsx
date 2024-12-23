import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL } from "../../config";


const WhatsAppLeadForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        place: "",
        district: "",
        state: "",
        pin: "",
        college: "",
        university: "",
        qualification: "",
        year_of_passout: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseURL}/api/whatsappLeads/saveWhatsAppLeadData`,
                formData
            );

            if (response.status === 201) {
                toast.success("Thank you for your interest! We will contact you soon.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    place: "",
                    district: "",
                    state: "",
                    pin: "",
                    college: "",
                    university: "",
                    qualification: "",
                    year_of_passout: "",
                });
            }
        } catch (error) {
            console.error("Error while saving lead data : ", error)
            toast.error(error.message || "Failed to save your details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Get in Contact</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {[
                                    { label: "Name", name: "name", type: "text" },
                                    { label: "Email", name: "email", type: "email" },
                                    { label: "Phone", name: "phone", type: "text" },
                                    { label: "Place", name: "place", type: "text" },
                                    { label: "District", name: "district", type: "text" },
                                    { label: "State", name: "state", type: "text" },
                                    { label: "PIN Code", name: "pin", type: "text" },
                                    { label: "College", name: "college", type: "text" },
                                    { label: "University", name: "university", type: "text" },
                                    { label: "Qualification", name: "qualification", type: "text" },
                                    { label: "Year of Passout", name: "year_of_passout", type: "number" },
                                ].map(({ label, name, type }) => (
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
                                            required
                                        />
                                    </div>
                                ))}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppLeadForm;

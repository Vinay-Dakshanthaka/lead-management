import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL } from "../../config";

const SignUpWithDummyPassword = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Loading state

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        return phone.length === 10 && /^[0-9]+$/.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!validateEmail(email)) {
            validationErrors.email = "Please enter a valid email address.";
        }

        if (!validatePhone(phone)) {
            validationErrors.phone = "Phone number must be 10 digits.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true); // Start loading animation

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token provided.");
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${baseURL}/api/auth/signUpWithDummyPassword`, {
                email,
                phone,
            }, config);

            if (response.status === 201) {
                toast.success("Account created successfully! Check your email for the password.");
                setEmail("");
                setPhone("");
            }
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                if (statusCode === 403) {
                    toast.error("Access denied. Insufficient permissions.");
                } else if (statusCode === 404) {
                    toast.error("No user found.");
                } else if (statusCode === 409) {
                    toast.error("Counsellor with this email or phone number already exists.");
                } else {
                    toast.error("Failed to create account.");
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className="container my-5">
            <h2>Create  Account for Counsellor</h2>
            <form onSubmit={handleSubmit} className="form">
                {/* Email Field */}
                <div className="form-group col-lg-6 col-md-8 col-sm-12 my-3">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        disabled={loading} // Disable input while loading
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Phone Field */}
                <div className="form-group col-lg-6 col-md-8 col-sm-12 my-3">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="text"
                        id="phone"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number (10 digits)"
                        disabled={loading} // Disable input while loading
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {" "}Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>
        </div>
    );
};

export default SignUpWithDummyPassword;

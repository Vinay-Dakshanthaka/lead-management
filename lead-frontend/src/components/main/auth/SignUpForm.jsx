// src/components/SignUpForm.jsx
import React, { useState } from 'react';
import { FaEye, FaEyeSlash,FaSpinner  } from 'react-icons/fa'; // Eye icons
import { toast, Toaster } from 'react-hot-toast'; // For toast notifications
import axios from 'axios'; // To send the request to the API
import { Link } from 'react-router-dom';
import { baseURL } from '../../config';
// import 'bootstrap/dist/css/bootstrap.min.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        // name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading

    // Validation helper functions
    // const validateName = (name) => name.length >= 3;
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone) => /^\d{10}$/.test(phone);
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password);

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { 
            // name,
             email, phone, password, confirmPassword } = formData;
        let formErrors = {};

        // Form validations
        // if (!validateName(name)) formErrors.name = "Name must be at least 3 characters long";
        if (!validateEmail(email)) formErrors.email = "Invalid email format";
        if (!validatePhone(phone)) formErrors.phone = "Phone number must be exactly 10 digits";
        if (!validatePassword(password)) formErrors.password = "Password must contain an uppercase letter, lowercase letter, a number, and a symbol";
        if (password !== confirmPassword) formErrors.confirmPassword = "Passwords do not match";

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            // Send data to the backend if no validation errors
            setLoading(true); // Set loading to true before the request
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    // setError("No token provided.");
                    return;
                }
        
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.post(`${baseURL}/api/auth/sign-up`, {
                    // name,
                    email,
                    phone,
                    password,
                });
                if (response.status === 201) {
                    toast.success('Account created successfully');
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    toast.error('User with this email or phone number already exists');
                    console.error(error)
                    
                }else if(error.response && error.response.status === 403){
                    toast.error('Access Forbidden');
                    console.errore(error)
                } else {
                    toast.error('Failed to create account');
                    console.error(error)
                }
            }finally {
                setLoading(false); // Set loading to false after request is complete
            }
        } else {
            toast.error('Please fix the form errors');
        }
    };

    return (
        <div className="container mt-5">
            <Toaster />
            <h2 className="text-center mb-4">Create Account for Counsellor</h2>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <form onSubmit={handleSubmit} className="w-100">
                        {/* Name field */}
                        {/* <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div> */}

                        {/* Email field */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {/* Phone field */}
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                id="phone"
                                name="phone"
                                placeholder="Phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>

                        {/* Password field */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                            </div>
                        </div>

                        {/* Confirm Password field */}
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                            </div>
                        </div>

                        {/* Submit button */}
                           {/* Submit button */}
                           <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner-border spinner-border-sm me-2" />
                                    Loading...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                        {/* <button type="submit" className="btn btn-primary w-100">Sign Up</button> */}
                        {/* <div className="text-center mt-3">
                            <Link to='/sign-in' className='d-block mb-2'>Already have an account? Sign In</Link>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;

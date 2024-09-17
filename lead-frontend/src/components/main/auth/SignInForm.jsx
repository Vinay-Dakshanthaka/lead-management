import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast'; // For toast notifications
import axios from 'axios'; // To send the request to the API
import { Link, useNavigate } from 'react-router-dom'; // For navigation
import { baseURL } from '../../config';

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  // Validation helper functions
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length > 0;

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    let formErrors = {};

    // Form validations
    if (!validateEmail(email)) formErrors.email = "Invalid email format";
    if (!validatePassword(password)) formErrors.password = "Password is required";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(`${baseURL}/api/auth/sign-in`, { email, password });
        console.log(response.data);

        if (response.status === 200) {
          // Correctly destructure the response data
          const { role, token, password_updated } = response.data;
          
          // Store the role, token, and password_updated in localStorage
          localStorage.setItem('role', role);
          localStorage.setItem('token', token);
          localStorage.setItem('password_updated', password_updated); // Storing the correct password_updated value
          
          toast.success('Sign-in successful');
          setTimeout(() => {
            // If password has not been updated, redirect user to the password update page
            if (!password_updated) {
              navigate('/update-password'); // You should implement this route to handle the password update
            } else {
              // Redirect based on role
              if (role === 'ADMIN') {
                navigate('/admin-dashboard');
              } else if (role === 'COUNSELLOR') {
                navigate('/counsellor-dashboard');
              }
            }
          }, 2000);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error('Invalid email or password');
          console.log(error);
        } else {
          toast.error('Failed to sign in');
          console.log(error);
        }
      }
    } else {
      toast.error('Please fix the form errors');
    }
  };

  return (
    <>
      <div className=" display-1 text-primary text-center my-2">Lead Management </div>
      <div className="container mt-5">
        <Toaster />
        <h2 className="text-center mb-4">Sign In</h2>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <form onSubmit={handleSubmit} className="w-100">
              {/* Email field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Password field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {/* Submit button */}
              <button type="submit" className="btn btn-primary w-100">Sign In</button>

              {/* Forgot Password & Signup Links */}
              <div className="text-center mt-3">
                <Link to='/forgot-password' className='d-block mb-2'>Forgot Password?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInForm;

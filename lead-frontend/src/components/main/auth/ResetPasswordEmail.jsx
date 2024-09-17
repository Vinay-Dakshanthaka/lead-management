import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../config';
import toast, { Toaster } from 'react-hot-toast';

const ResetPasswordEmail = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        // Basic email validation using regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${baseURL}/api/auth/password-reset-email`, { email });

            if (response.status === 200) {
                setSuccessMessage('Reset password link sent successfully. Check your email.');
                toast.success('Reset password link sent successfully');
                // setTimeout(() => {
                //     navigate('/signin'); 
                // }, 2000);
            }
        } catch (error) {
            if(error.response.status === 403){
                setErrorMessage('No User Exist with this Email Id')
            }else {
                setErrorMessage('Failed to send reset password link. Please try again.');
            }
            console.error('Error sending reset password email:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center my-5 vh-75" >
            <div className="card p-4 shadow-lg" style={{ width: '400px', maxWidth: '100%', borderRadius: '20px', background: '#ecf0f3', boxShadow: '7px 7px 15px #cbced1, -7px -7px 15px #ffffff' }}>
                <h3 className="card-title text-center" style={{ marginBottom: '20px', color: '#333' }}>Reset Password</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={{ borderRadius: '10px' }}
                            required
                        />
                    </div>
                    <Button type="submit" className="btn btn-primary w-100" disabled={isLoading} >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Send Reset Link'
                        )}
                    </Button>
                </Form>
                <div className="mt-3 text-center">
                    <span style={{ color: '#555' }}>Remember your password? </span>
                    <button onClick={() => { navigate('/sign-in') }} className='link btn text-primary'>Sign In</button>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default ResetPasswordEmail;

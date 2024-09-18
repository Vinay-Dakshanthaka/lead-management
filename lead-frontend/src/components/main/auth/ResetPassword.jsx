import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { baseURL } from '../../config';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    const validateForm = () => {
        if (!newPassword || !confirmPassword) {
            setErrorMessage('All fields are required');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage('New password and confirm password do not match');
            return false;
        }
        if (!passwordPattern.test(newPassword)) {
            setErrorMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 numeric character, 1 special symbol, and have a minimum length of 6 characters');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${baseURL}/api/auth/reset-password?token=${token}`, {
                newPassword
            });

            if (response.status === 200) {
                setSuccessMessage('Password reset successfully');
                toast.success('Password reset successfully');
                setTimeout(() => {
                    navigate('/sign-in'); // Redirect to signin page after successful password reset
                }, 2000);
            }
        } catch (error) {
            setErrorMessage('Failed to reset password. Please try again.');
            console.error('Error resetting password:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center my-5" >
            <div className="card p-4 shadow-lg" style={{ width: '400px', maxWidth: '100%', borderRadius: '20px', background: '#ecf0f3', boxShadow: '7px 7px 15px #cbced1, -7px -7px 15px #ffffff' }}>
                <h3 className="card-title text-center" style={{ marginBottom: '20px', color: '#333' }}>Reset Password</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            style={{ borderRadius: '10px' }}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            style={{ borderRadius: '10px' }}
                            required
                        />
                    </div>
                    <Button type="submit" className="btn btn-primary w-100" disabled={isLoading} >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Reset Password'
                        )}
                    </Button>
                </Form>
                <div className="mt-3 text-center">
                    <span style={{ color: '#555' }}>Remember your password? </span>
                    <button onClick={() => { navigate('/sign-in') }} className='link'>Sign In</button>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default ResetPassword;

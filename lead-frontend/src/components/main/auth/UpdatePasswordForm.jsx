import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { baseURL } from '../../config';
import { Link, useNavigate } from 'react-router-dom';

const UpdatePasswordForm = () => {
  const [originalPassword, setOriginalPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    // Start loading spinner
    setLoading(true);


    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization error: No token found.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        originalPassword,
        newPassword,
      };

      // Post the data to update the password
      const response = await axios.post(`${baseURL}/api/auth/updatePassword`, payload, config);

      // Success response handling
      toast.success(response.data.message);
      setOriginalPassword('');
      setNewPassword('');
      setConfirmPassword('');
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('password_updated')
      navigate('/sign-in');

    } catch (error) {
      // Error handling
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Error updating password');
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  return (
    <Container>
      <Link to='/update-profile' className='btn btn-outline-primary'>Update Details</Link>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6}>
          <h3 className="text-center mb-4">Update Your Password</h3>

          {/* Error Alert */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="originalPassword" className="mb-3">
              <Form.Label>Original Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your original password"
                value={originalPassword}
                onChange={(e) => setOriginalPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Submit button */}
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Update Password'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatePasswordForm;

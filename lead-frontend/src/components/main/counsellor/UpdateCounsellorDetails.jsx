import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { baseURL } from '../../config';

const UpdateCounsellorDetails = ({ counsellor_id }) => {
    const [counsellor, setCounsellor] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    // Fetch counsellor details
    const fetchCounsellorDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
              setError("No token provided.");
              setLoading(false);
              return;
            }
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            const response = await axios.get(`${baseURL}/api/counsellor/getCounsellorDetailsById`, config);
            setCounsellor(response.data.counsellor);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Failed to fetch counsellor details");
        }
    };

    // Update counsellor details
    const updateCounsellorDetails = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
              setError("No token provided.");
              setLoading(false);
              return;
            }
    
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            setLoading(true);
            await axios.put(`${baseURL}/api/counsellor/updateCounsellorDetailsById`, {
                counsellor_id,
                name: counsellor.name,
                email: counsellor.email,
                phone: counsellor.phone
            },config);
            setLoading(false);
            toast.success("Counsellor details updated successfully");
        } catch (error) {
            setLoading(false);
            toast.error("Failed to update counsellor details");
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCounsellor({
            ...counsellor,
            [name]: value
        });
    };

    useEffect(() => {
        fetchCounsellorDetails();
    }, [counsellor_id]);

    return (
        <Container>
            <Toaster />
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="text-center">Update Details</h2>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Form onSubmit={updateCounsellorDetails}>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    name="name"
                                    value={counsellor.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formEmail" className="mt-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={counsellor.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPhone" className="mt-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter phone"
                                    name="phone"
                                    value={counsellor.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="mt-4">
                                Update Details
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default UpdateCounsellorDetails;

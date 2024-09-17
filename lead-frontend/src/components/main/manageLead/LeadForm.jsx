import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { baseURL } from '../../config';
import CounsellorSelect from '../admin/CounsellorSelect';

const LeadForm = () => {
    const { lead_id } = useParams();
    const navigate = useNavigate();
    const [leadData, setLeadData] = useState({
        name: '',
        email: '',
        phone: '',
        counsellor_id: '' // Add counsellor_id to state
    });

    useEffect(() => {
        if (lead_id) {
            // Fetch lead data by lead_id and populate the form
            axios.get(`${baseURL}/api/lead/get-lead-data-by-id/${lead_id}`)
                .then(response => {
                    const data = response.data.lead;
                    setLeadData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        counsellor_id: data.counsellor_id || '' // Set counsellor_id from the API response
                    });
                })
                .catch(error => {
                    console.error('Error fetching lead data:', error);
                });
        }
    }, [lead_id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLeadData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCounsellorSelect = (selectedCounsellorId) => {
        setLeadData(prevState => ({
            ...prevState,
            counsellor_id: selectedCounsellorId // Update counsellor_id in state
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
            ...leadData,
            lead_id: lead_id ? lead_id : undefined
        };

        const endpoint = lead_id
            ? `${baseURL}/api/lead/update-lead-data/${lead_id}`
            : `${baseURL}/api/lead/save-lead-data`;

        axios.post(endpoint, postData)
            .then(response => {
                toast.success('Lead data saved successfully!');
                // navigate('/overview'); 
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    toast.error("Lead with this phone number already exists");
                } else {
                    toast.error('Error saving lead data. Please try again.');
                    console.error('Error saving lead data:', error);
                }
            });
    };

    return (
        <Container>
            <Toaster position="top-right" reverseOrder={false} />
            <h2>{lead_id ? 'Edit Lead' : 'Add New Lead'}</h2>
            <Form onSubmit={handleSubmit} className='col-lg-6 col-md-12 col-sm-12'>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={leadData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEmail" className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={leadData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPhone" className='mb-3'>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone"
                        name="phone"
                        value={leadData.phone}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Counsellor selection */}
                <CounsellorSelect onSelect={handleCounsellorSelect} />

                <Button variant="primary" type="submit" className="mt-3">
                    {lead_id ? 'Update Lead' : 'Add '}
                </Button>
            </Form>
        </Container>
    );
};

export default LeadForm;

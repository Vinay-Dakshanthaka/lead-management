import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';

const LeadForm = () => {
    const { lead_id } = useParams();
    const navigate = useNavigate();
    const [leadData, setLeadData] = useState({
        name: '',
        email: '',
        phone: '',
        response: '',
        contacted_date: '',
        next_contact_date: '',
        joining_status: false, // Field for joined status
        is_contacted_today: false // New field for contacted today status
    });

    useEffect(() => {
        if (lead_id) {
            // Fetch lead data by lead_id and populate the form
            axios.get(`http://localhost:3003/api/lead/get-lead-data-by-id/${lead_id}`)
                .then(response => {
                    const data = response.data.lead;
                    setLeadData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        response: data.response || '',
                        contacted_date: moment(data.contacted_date).format('YYYY-MM-DD') || '',
                        next_contact_date: moment(data.next_contact_date).format('YYYY-MM-DD') || '',
                        joining_status: data.joining_status || false, // Set the joined status from the API response
                        is_contacted_today: data.is_contacted_today || false // Set contacted today status from API response
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
            [name]: type === 'checkbox' ? checked : value // Handle checkboxes for joined status and contacted today
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
            ...leadData,
            lead_id: lead_id ? lead_id : undefined  // Include lead_id only if it's present
        };

        const endpoint = lead_id
            ? `http://localhost:3003/api/lead/update-lead-data/${lead_id}`
            : 'http://localhost:3003/api/lead/save-lead-data';

        axios.post(endpoint, postData)
            .then(response => {
                toast.success('Lead data saved successfully!');
                // navigate('/overview');  // Redirect to overview after saving
            })
            .catch(error => {
                if(error.response && error.response.status === 409 ){
                    toast.error("Lead with this email or phone number already exists")
                }else{
                    toast.error('Error saving lead data. Please try again.');
                    console.error('Error saving lead data:', error);
                }
            });
    };

    return (
        <Container>
            <Toaster position="top-right" reverseOrder={false} />
            <h2>{lead_id ? 'Edit Lead' : 'Add New Lead'}</h2> {/* Updated Heading */}
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

                <Form.Group controlId="formResponse" className='mb-3'>
                    <Form.Label>Response</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Enter response"
                        name="response"
                        value={leadData.response}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formContactedDate" className='mb-3'>
                    <Form.Label>Contacted Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="contacted_date"
                        value={leadData.contacted_date}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formNextContactDate" className='mb-3'>
                    <Form.Label>Next Contact Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="next_contact_date"
                        value={leadData.next_contact_date}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* New Joined Status Field */}
                <Form.Group controlId="formJoinedStatus" className='mb-3'>
                    <div className="d-flex align-items-center">
                        <Form.Check
                            type="checkbox"
                            name="joining_status"
                            checked={leadData.joining_status}
                            onChange={handleChange}
                            className="form-check-input me-2"
                            style={{ width: '20px', height: '20px' }} // Custom size
                        />
                        <Form.Label className="form-check-label fs-5">Joined Course</Form.Label>
                    </div>
                </Form.Group>

                {/* New Is Contacted Today Field */}
                <Form.Group controlId="formIsContactedToday" className='mb-3'>
                    <div className="d-flex align-items-center">
                        <Form.Check
                            type="checkbox"
                            name="is_contacted_today"
                            checked={leadData.is_contacted_today}
                            onChange={handleChange}
                            className="form-check-input me-2"
                            style={{ width: '20px', height: '20px' }} // Custom size
                        />
                        <Form.Label className="form-check-label fs-5">Contacted Today</Form.Label>
                    </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    {lead_id ? 'Update Lead' : 'Add Lead'}
                </Button>
            </Form>

        </Container>
    );
};

export default LeadForm;

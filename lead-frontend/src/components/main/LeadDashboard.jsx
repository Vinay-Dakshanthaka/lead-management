import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Row, Col, Card } from 'react-bootstrap';
import Overview from './Overview';
import { baseURL } from '../config';

const LeadDashboard = () => {
    const [leadData, setLeadData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${baseURL}/api/lead/get-lead-data`)
            .then(response => {
                setLeadData(response.data.leads);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching leads:', error);
                setLoading(false);
            });
    }, []);

    // Calculate summary metrics for the dashboard
    const totalLeads = leadData.length;

    // Exact match for "interested" and "not interested"
    const interestedLeads = leadData.filter(lead => lead.response.trim().toLowerCase() === 'interested').length;
    const notInterestedLeads = leadData.filter(lead => lead.response.trim().toLowerCase() === 'not interested').length;

    // Creating a pivot table for interested/not interested
    const pivotData = leadData.reduce((pivot, lead) => {
        const response = lead.response.trim().toLowerCase();
        const status = response === 'interested' ? 'Interested' : response === 'not interested' ? 'Not Interested' : 'Other';

        if (!pivot[status]) {
            pivot[status] = 1;
        } else {
            pivot[status]++;
        }
        return pivot;
    }, {});


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <h2>Leads Dashboard</h2>
            <Row>
                {/* Summary Cards */}
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Total Leads</Card.Title>
                            <Card.Text>{totalLeads}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Interested Leads</Card.Title>
                            <Card.Text>{interestedLeads}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Not Interested Leads</Card.Title>
                            <Card.Text>{notInterestedLeads}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Pivot Table */}
            <h3 className="mt-5">Lead Status Overview</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(pivotData).map(([status, count], index) => (
                        <tr key={index}>
                            <td>{status}</td>
                            <td>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Detailed Lead Table */}
            <h3 className="mt-5">Lead Details</h3>
           <Overview />
        </Container>
    );
};

export default LeadDashboard;

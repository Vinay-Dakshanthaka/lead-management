import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import { Table, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    totalJoinedLeads: 0,
    totalInterestedLeads: 0,
    counsellorJoinedLeads: [],
    counsellorInterestedLeads: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/admin/dashboard-overview`);
        setDashboardData(response.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error('Error:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard Overview</h2>

      {/* Cards for Total Leads, Joined Leads, and Interested Leads */}
      <Row className="mb-4">
        <Col md={4} sm={12} className="mb-3">
          <Card>
            <Card.Body className='text-center'>
              <Card.Title>Total Leads</Card.Title>
              <Card.Text className="display-4">{dashboardData.totalLeads}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card>
            <Card.Body className='text-center'>
              <Card.Title>Leads Joined</Card.Title>
              <Card.Text className="display-4">{dashboardData.totalJoinedLeads}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card>
            <Card.Body className='text-center'>
              <Card.Title>Interested Leads</Card.Title>
              <Card.Text className="display-4">{dashboardData.totalInterestedLeads}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Counsellor-wise Joined Leads */}
      <h3 className="mb-3">Counsellor-wise Joined Leads</h3>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Counsellor Name</th>
            <th>Email</th>
            <th>Joined Leads Count</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.counsellorJoinedLeads.map(counsellor => (
            <tr key={counsellor.counsellor_id}>
              <td>{counsellor.Counsellor.name}</td>
              <td>{counsellor.Counsellor.email}</td>
              <td>{counsellor.joined_leads_count}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Counsellor-wise Interested Leads */}
      <h3 className="mb-3">Counsellor-wise Interested Leads</h3>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Counsellor Name</th>
            <th>Email</th>
            <th>Interested Leads Count</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.counsellorInterestedLeads.map(counsellor => (
            <tr key={counsellor.counsellor_id}>
              <td>{counsellor.Counsellor.name}</td>
              <td>{counsellor.Counsellor.email}</td>
              <td>{counsellor.interested_leads_count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;

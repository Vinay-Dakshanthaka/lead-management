import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Form, Pagination, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const Overview = () => {
  const [leadData, setLeadData] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10); // Set number of leads per page
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/lead/get-lead-data');

        const today = moment().startOf('day');
        // Sort leads, prioritizing those with today's next contact date
        const sortedLeads = response.data.leads.sort((a, b) => {
          const aIsToday = moment(a.next_contact_date).isSame(today, 'day');
          const bIsToday = moment(b.next_contact_date).isSame(today, 'day');
          if (aIsToday && !bIsToday) return -1;
          if (!aIsToday && bIsToday) return 1;
          return moment(a.next_contact_date).diff(moment(b.next_contact_date));
        });

        setLeadData(sortedLeads);
        setFilteredLeads(sortedLeads);

        // Check if any of the leads have next_contact_date as today and haven't been contacted
        const hasTodayContact = sortedLeads.some(
          lead => moment(lead.next_contact_date).isSame(today, 'day') && !lead.is_contacted_today
        );
        setShowNotification(hasTodayContact);
      } catch (error) {
        console.error('Error fetching lead data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const filtered = leadData.filter(lead =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      moment(lead.next_contact_date).format('YYYY-MM-DD').includes(searchQuery)
    );
    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchQuery, leadData]);

  // Get current leads for pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (lead_id) => {
    navigate(`/lead-form/${lead_id}`);
  };

  return (
    <>
      {showNotification && (
        <Alert variant="info bg-info" className='fs-5 fw-bold text-danger'>
          ⚠️ Today is the next contact date for one or more leads. Please follow up! ⚠️
        </Alert>
      )}
      <Form.Control
        type="text"
        placeholder="Search by Name, Phone, or Date"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />
      {filteredLeads.length > 0 ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>SI No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Response</th>
                <th>Contacted Date</th>
                <th>Next Contact Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead, index) => (
                <tr
                  key={lead.lead_id}
                  className={
                    moment(lead.next_contact_date).isSame(moment(), 'day') && !lead.is_contacted_today
                      ? 'bg-warning'
                      : ''
                  }
                  style={{
                    fontWeight:
                      moment(lead.next_contact_date).isSame(moment(), 'day') && !lead.is_contacted_today
                        ? 'bold'
                        : 'normal'
                  }}
                >
                  <td>{indexOfFirstLead + index + 1}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.response}</td>
                  <td>{moment(lead.contacted_date).format('YYYY-MM-DD')}</td>
                  <td>{moment(lead.next_contact_date).format('YYYY-MM-DD')}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(lead.lead_id)}>Edit</Button>
                  </td>
                  {/* Show badge only if the next contact date is today and is_contacted_today is false */}
                  {moment(lead.next_contact_date).isSame(moment(), 'day') && !lead.is_contacted_today && (
                    <td>
                      <Badge bg="warning">Due today</Badge>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="text-center d-flex align-items-center justify-content-center">
            <Pagination>
              {[...Array(Math.ceil(filteredLeads.length / leadsPerPage)).keys()].map(number => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Overview;

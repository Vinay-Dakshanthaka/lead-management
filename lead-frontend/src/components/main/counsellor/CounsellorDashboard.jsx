import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Spinner, Button, Modal, Badge, Alert } from 'react-bootstrap';
import { baseURL } from '../../config';
import UpdateLeadForm from '../manageLead/UpdateLeadForm';
import moment from 'moment'; // Using moment.js for date comparison

const CounsellorDashboard = () => {
  const { counsellor_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [hasTodayLeads, setHasTodayLeads] = useState(false); // To track if there are any leads with next contact date as today

  useEffect(() => {
    const fetchData = async () => {
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
        const response = await axios.get(`${baseURL}/api/counsellor/getAllLeadsForCounsellorById`, config);

        if (response.status === 404) {
          setError('No leads found for this counsellor.');
        } else {
          setData(response.data);

          // Check if there are any leads with the next contact date as today
          const hasTodayLeads = response.data.leads.some(lead => 
            lead.next_contact_date && moment(lead.next_contact_date).isSame(moment(), 'day')
          );
          setHasTodayLeads(hasTodayLeads);
        }
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('No active leads found.');
        } else {
          setError('Error fetching data');
        }
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [counsellor_id]);

  const handleUpdateClick = (lead_id) => {
    setSelectedLeadId(lead_id);
    setShowModal(true);
  };

  // Function to check if the next contact date is today
  const isToday = (nextContactDate) => {
    return moment(nextContactDate).isSame(moment(), 'day');
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      {/* Display notification if there are any leads with next contact date as today */}
      {hasTodayLeads && (
        <Alert variant="warning">
          You have leads that need to be contacted today!
        </Alert>
      )}

      {data && (
        <>
          <h3 className="mb-4">Assigned Leads</h3>
          <Table responsive bordered striped hover>
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Assigned Date</th>
                <th>Response</th>
                <th>Interested</th>
                <th>Contacted Date</th>
                <th>Next Contact Date</th>
                <th>Joining Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => {
                const nextContactDate = lead.next_contact_date ? moment(lead.next_contact_date).toDate() : null;
                const isLeadNextContactToday = nextContactDate && isToday(nextContactDate);

                return (
                  <tr key={lead.lead_id} className={isLeadNextContactToday ? 'bg-warning text-dark' : ''}>
                    <td>{lead.lead_id}</td>
                    <td>{lead.lead_name}</td>
                    <td>{lead.lead_email}</td>
                    <td>{lead.lead_phone}</td>
                    <td>{new Date(lead.assigned_date).toLocaleDateString()}</td>
                    <td>{lead.response || 'N/A'}</td>
                    <td>{lead.is_interested ? 'Yes' : 'No'}</td>
                    <td>{lead.contacted_date ? new Date(lead.contacted_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {nextContactDate
                        ? isLeadNextContactToday
                          ? <>
                              {moment(nextContactDate).format('DD/MM/YYYY')}
                              <Badge variant="danger" className="ml-2">Today</Badge>
                            </>
                          : moment(nextContactDate).format('DD/MM/YYYY')
                        : 'N/A'}
                    </td>
                    <td>{lead.lead_joining_status ? 'Joined' : 'Not Joined'}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleUpdateClick(lead.lead_id)}>
                        Update
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* Modal for updating leads */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Update Lead</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedLeadId && <UpdateLeadForm lead_id={selectedLeadId} counsellor_id={counsellor_id} closeModal={() => setShowModal(false)} />}
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default CounsellorDashboard;

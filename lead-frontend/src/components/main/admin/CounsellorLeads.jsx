import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap';
import { baseURL } from '../../config';

const CounsellorLeads = () => {
  const { counsellor_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${baseURL}/api/admin/get-leads-by-counsellor`, { counsellor_id });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [counsellor_id]);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      {data && (
        <>
          <h3 className="mb-4 fw-bold text-primary">Counsellor Details</h3>
          <div className="counsellor-info mb-4 row">
            <p className='col-lg-4 col-md-auto col-sm-auto fw-bold lead'><strong>ID:</strong> {data.counsellor.counsellor_id}</p>
            <p className='col-lg-4 col-md-auto col-sm-auto fw-bold lead'><strong>Name:</strong> {data.counsellor.counsellor_name || 'N/A'}</p>
            <p className='col-lg-4 col-md-auto col-sm-auto fw-bold lead'><strong>Email:</strong> {data.counsellor.counsellor_email}</p>
            <p className='col-lg-4 col-md-auto col-sm-auto fw-bold lead'><strong>Phone:</strong> {data.counsellor.counsellor_phone}</p>
          </div>

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
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => (
                <tr key={lead.lead_id}>
                  <td>{lead.lead_id}</td>
                  <td>{lead.lead_name}</td>
                  <td>{lead.lead_email}</td>
                  <td>{lead.lead_phone}</td>
                  <td>{new Date(lead.assigned_date).toLocaleDateString()}</td>
                  <td>{lead.response || 'N/A'}</td>
                  <td>{lead.is_interested ? 'Yes' : 'No'}</td>
                  <td>{lead.contacted_date ? new Date(lead.contacted_date).toLocaleDateString() : 'N/A'}</td>
                  <td>{lead.next_contact_date ? new Date(lead.next_contact_date).toLocaleDateString() : 'N/A'}</td>
                  <td>{lead.lead_joining_status ? 'Joined' : 'Not Joined'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default CounsellorLeads;

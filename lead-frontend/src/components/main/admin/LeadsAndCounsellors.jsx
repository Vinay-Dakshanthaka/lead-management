// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Table, Container, Row, Col, Spinner } from 'react-bootstrap';
// import { baseURL } from '../../config'; // Adjust the path if needed

// const LeadsAndCounsellors = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${baseURL}/api/admin/getAllLeadsAndCounsellors`);
//         setData(response.data.leads);
//         console.log(response.data)
//       } catch (error) {
//         setError('Failed to fetch data');
//         console.error('Error fetching leads and counsellors:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <Container className="text-center my-5">
//         <Spinner animation="border" />
//         <p>Loading data...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="text-center my-5">
//         <p>{error}</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <h2 className="text-center mb-4">Leads and Counsellors</h2>
//       {data.length === 0 ? (
//         <Row>
//           <Col>
//             <p className="text-center">No leads found</p>
//           </Col>
//         </Row>
//       ) : (
//         data.map((lead) => (
//           <div key={lead.lead_id} className="mb-4">
//             <h4>Lead ID: {lead.lead_id}</h4>
//             <p><strong>Name:</strong> {lead.lead_name}</p>
//             <p><strong>Email:</strong> {lead.lead_email}</p>
//             <p><strong>Phone:</strong> {lead.lead_phone}</p>
//             <p><strong>Joining Status:</strong> {lead.lead_joining_status ? 'Joined' : 'Not Joined'}</p>
            
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Counsellor ID</th>
//                   <th>Counsellor Name</th>
//                   <th>Counsellor Email</th>
//                   <th>Counsellor Phone</th>
//                   <th>Assigned Date</th>
//                   <th>Response</th>
//                   <th>Interested</th>
//                   <th>Contacted Date</th>
//                   <th>Next Contact Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {lead.counsellors.length === 0 ? (
//                   <tr>
//                     <td colSpan="9" className="text-center">No counsellors assigned</td>
//                   </tr>
//                 ) : (
//                   lead.counsellors.map((counsellor) => (
//                     <tr key={counsellor.counsellor_id}>
//                       <td>{counsellor.counsellor_id}</td>
//                       <td>{counsellor.counsellor_name || 'N/A'}</td>
//                       <td>{counsellor.counsellor_email}</td>
//                       <td>{counsellor.counsellor_phone}</td>
//                       <td>{new Date(counsellor.assigned_date).toLocaleDateString()}</td>
//                       <td>{counsellor.response || 'N/A'}</td>
//                       <td>{counsellor.is_interested ? 'Yes' : 'No'}</td>
//                       <td>{counsellor.contacted_date ? new Date(counsellor.contacted_date).toLocaleDateString() : 'N/A'}</td>
//                       <td>{counsellor.next_contact_date ? new Date(counsellor.next_contact_date).toLocaleDateString() : 'N/A'}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         ))
//       )}
//     </Container>
//   );
// };

// export default LeadsAndCounsellors;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from '../../config';
import LeadCounsellorDetailsModal from './LeadCounsellorDetailsModal'; // Import the modal
import { Link } from 'react-router-dom';

const LeadsAndCounsellors = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounsellor, setSelectedCounsellor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token provided.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${baseURL}/api/admin/getAllLeadsAndCounsellors`, config);
        setLeads(response.data.leads);
        setFilteredLeads(response.data.leads);
      } catch (error) {
        toast.error('Failed to fetch leads and counsellors data');
        console.error('Error fetching data:', error);
      }
    };

    fetchLeads();
  }, []);

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    filterLeads(value, selectedCounsellor);
  };

  const handleCounsellorFilter = (e) => {
    const value = e.target.value;
    setSelectedCounsellor(value);
    filterLeads(searchQuery, value);
  };

  const filterLeads = (search, counsellor) => {
    let filtered = leads.filter((lead) => 
      (lead.lead_name?.toLowerCase() || '').includes(search) || 
      (lead.lead_email?.toLowerCase() || '').includes(search) || 
      (lead.lead_phone || '').includes(search)
    );
  
    if (counsellor) {
      filtered = filtered.filter((lead) => 
        lead.counsellors.some(c => 
          (c.counsellor_name || '').toLowerCase() === counsellor.toLowerCase() || 
          (c.counsellor_email || '').toLowerCase() === counsellor.toLowerCase()
        )
      );
    }
  
    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };
  

  const paginateLeads = () => {
    const indexOfLastLead = currentPage * itemsPerPage;
    const indexOfFirstLead = indexOfLastLead - itemsPerPage;
    return filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  };

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="container ">
        <Link to='/assign-lead-to-counsellor' className='btn btn-outline-primary' >Reassign Leads to Counsellor</Link>
      </div>
      <h2>Leads and Counsellors</h2>

      <div className="mb-3">
        <Form.Control 
          type="text" 
          placeholder="Search by name, email, or phone number" 
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="mb-3">
        <Form.Control as="select" value={selectedCounsellor} onChange={handleCounsellorFilter}>
          <option value="">Filter by Counsellor</option>
          {leads.flatMap(lead => lead.counsellors)
            .map(counsellor => counsellor.counsellor_name || counsellor.counsellor_email)
            .filter((c, index, self) => self.indexOf(c) === index) // Unique values
            .map(counsellor => (
              <option key={counsellor} value={counsellor}>
                {counsellor}
              </option>
            ))
          }
        </Form.Control>
      </div>

      <Table responsive bordered>
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Lead Email</th>
            <th>Lead Phone</th>
            <th>Active Counsellor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginateLeads().map((lead) => {
            const activeCounsellor = lead.counsellors.find(c => c.is_active);
            return (
              <tr key={lead.lead_id}>
                <td>{lead.lead_name}</td>
                <td>{lead.lead_email}</td>
                <td>{lead.lead_phone}</td>
                <td>
                  {activeCounsellor
                    ? activeCounsellor.counsellor_name || activeCounsellor.counsellor_email
                    : 'No active counsellor'}
                </td>
                <td>
                  <Button variant="primary" onClick={() => handleViewDetails(lead)}>
                    View Details
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item 
              key={index + 1} 
              active={index + 1 === currentPage} 
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Pass the required props to the modal */}
      <LeadCounsellorDetailsModal
        showModal={showModal}
        handleClose={handleClose}
        selectedLead={selectedLead}
      />
    </div>
  );
};

export default LeadsAndCounsellors;



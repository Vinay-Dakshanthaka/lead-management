import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <>
      <Nav.Link as={Link} to="/admin-dashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/counsellor-details">Counsellors</Nav.Link>
      <Nav.Link as={Link} to="/leads">Leads</Nav.Link>
      {/* <Nav.Link as={Link} to="/assign-lead-to-counsellor">Assign Leads to Counsellor</Nav.Link> */}
      <Nav.Link as={Link} to="/add-new">Add New</Nav.Link>
      <Nav.Link as={Link} to="/upload-leads">Upload Leads</Nav.Link>
      <Nav.Link as={Link} to="/joined-leads">Joined Leads</Nav.Link>
      <Nav.Link as={Link} to="/create-account-counsellor">Create Account</Nav.Link>
    </>
  );
};

export default AdminNavbar;

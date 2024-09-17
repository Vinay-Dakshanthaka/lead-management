import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CounsellorNavbar = () => {
  return (
    <>
      {/* <Nav.Link as={Link} to="/overview">Overview</Nav.Link> */}
      <Nav.Link as={Link} to="/counsellor-dashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/joined-leads">Joined Leads</Nav.Link>
      {/* <Nav.Link as={Link} to="/lead-form/:lead_id">Joined Leads</Nav.Link> */}
    </>
  );
};

export default CounsellorNavbar;

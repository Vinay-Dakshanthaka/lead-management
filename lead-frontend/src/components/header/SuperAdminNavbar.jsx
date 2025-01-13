import React from 'react';
import { Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SuperAdminNavbar = () => {
  return (
    <>
      <Nav.Link as={Link} to="/superadmin-dashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/admin-signup-form">Add Admin</Nav.Link>
    </>
  );
};

export default SuperAdminNavbar;

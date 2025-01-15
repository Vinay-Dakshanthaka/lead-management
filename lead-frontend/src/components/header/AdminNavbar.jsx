// import React from 'react';
// import { Nav } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const AdminNavbar = () => {
//   return (
//     <>
//       <Nav.Link as={Link} to="/admin-dashboard">Dashboard</Nav.Link>
//       <Nav.Link as={Link} to="/counsellor-details">Counsellors</Nav.Link>
//       <Nav.Link as={Link} to="/leads">Leads</Nav.Link>
//       {/* <Nav.Link as={Link} to="/assign-lead-to-counsellor">Assign Leads to Counsellor</Nav.Link> */}
//       <Nav.Link as={Link} to="/add-new">Add New</Nav.Link>
//       <Nav.Link as={Link} to="/upload-leads">Upload Leads</Nav.Link>
//       <Nav.Link as={Link} to="/joined-leads">Joined Leads</Nav.Link>
//       <Nav.Link as={Link} to="/create-account-counsellor">Create Account</Nav.Link>
//       <Nav.Link as={Link} to="/create-template">Templates</Nav.Link>
//       <Nav.Link as={Link} to="/whatsApp-leads">WhatsApp Leads</Nav.Link>
//     </>
//   );
// };

// export default AdminNavbar;


import React from 'react';
import { Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <>
      <Nav.Link as={Link} to="/admin-dashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/counsellor-details">Counsellors</Nav.Link>

      {/* Dropdown for Lead Related Links */}
      <Dropdown>
        <Dropdown.Toggle variant="link" id="lead-dropdown" className="nav-link">
          Leads
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/leads">All Leads</Dropdown.Item>
          <Dropdown.Item as={Link} to="/joined-leads">Joined Leads</Dropdown.Item>
          <Dropdown.Item as={Link} to="/upload-leads">Upload Leads</Dropdown.Item>
          <Dropdown.Item as={Link} to="/assign-lead-to-counsellor">Assign Leads</Dropdown.Item>
          <Dropdown.Item as={Link} to="/add-new">Add New Lead</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Nav.Link as={Link} to="/create-account-counsellor">Create Account</Nav.Link>
      <Nav.Link as={Link} to="/group-management">Lead Groups</Nav.Link>
      <Nav.Link as={Link} to="/create-template">Templates</Nav.Link>
      <Nav.Link as={Link} to="/whatsApp-leads">WhatsApp Leads</Nav.Link>
      {/* <Nav.Link as={Link} to="/message-status-list">WhatsApp Leads</Nav.Link> */}
    </>
  );
};

export default AdminNavbar;

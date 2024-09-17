import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AdminNavbar from './AdminNavbar';
import CounsellorNavbar from './CounsellorNavbar';
import toast, { Toaster } from 'react-hot-toast';

const Header = ({ role, isLoggedIn, onSignOut }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('password_updated')
      toast.success('success')

        // Cookies.remove('token');
        // localStorage.removeItem('role');
        // onSignOut();
        navigate('/sign-in');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Toaster />
            <Container>
                <Navbar.Brand as={Link} to="/">Lead Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {role === 'ADMIN' && <AdminNavbar />}
                        {role === 'COUNSELLOR' && <CounsellorNavbar />}
                        {isLoggedIn ? (
                            <>
                            <Nav.Link as={Link} to="/update-password" >Update Password</Nav.Link>
                            <Nav.Link as={Link} to="/sign-in" onClick={handleSignOut}>Sign Out</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/sign-in">Sign In</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;

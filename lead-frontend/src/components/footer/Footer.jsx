import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4">
      <Container>
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Dashboard. All rights reserved.</p>
            <p>
              <a href="/overview" className="text-white">Overview</a> |{' '}
              <a href="/reports" className="text-white">Reports</a> |{' '}
              <a href="/settings" className="text-white">Settings</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

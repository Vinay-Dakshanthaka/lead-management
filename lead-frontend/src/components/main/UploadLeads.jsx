import React, { useState } from 'react';
import { Container, Form, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import excelImage from '../../assets/example_lead_excel_format.png'; // Importing the image file
import excelSheet from '../lead_upload_excel_format.xlsx'

const LeadUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Validate file type
    if (
      selectedFile &&
      (selectedFile.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel')
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid Excel file (.xlsx or .xls)');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios
      .post('http://localhost:3003/api/lead/upload-leads', formData)
      .then((response) => {
        setSuccessMessage('Leads uploaded successfully.');
        setError(null);
        setFile(null); // Clear the file input
      })
      .catch((error) => {
        setError('Failed to upload leads. Please try again.');
        console.error('Error uploading leads:', error);
        setSuccessMessage(null);
      });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = excelSheet;
    link.download = 'lead_upload_excel_format.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Example Excel sheet downloaded successfully!");
};

  // const handleDownloadTemplate = () => {
  //   const link = document.createElement('a');
  //   link.href = '/assets/lead_upload_excel_format.xlsx'; // Correct path to the file in public/assets
  //   link.download = 'lead_upload_excel_format.xlsx'; // Name of the file to be downloaded
  //   link.click(); // Trigger the download
  // };

  return (
    <Container className="mt-5">
      <h2>Upload Leads</h2>
      <div className='my-3'>
      <Button variant="secondary" className="me-3" onClick={() => setShowModal(true)}>
          View Excel Format
        </Button>
        <Button variant="info" className="me-3" onClick={handleDownload}>
          Download Excel Template
        </Button>
      </div>
      <Form onSubmit={handleUpload}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select Excel File</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Button variant="primary" type="submit" className='me-3'>
          Upload
        </Button>
      </Form>

      <div className="mt-4">
        <h5 className="bold">Excel Sheet Upload Information</h5>
        <ul>
          <li className="lead">
            <strong>Email Field:</strong> The email field is used to check for duplicates. If a lead
            with the same email already exists in the database, that row will be skipped.
          </li>
          <li className="lead">
            <strong>Date Format:</strong> Ensure that the <code>contacted_date</code> and{' '}
            <code>next_contact_date</code> fields are formatted as dates (<code>YYYY-MM-DD</code>)
            in your Excel sheet.
          </li>
          <li className="lead">
            <strong>Empty Fields:</strong> Rows where all fields are empty will be skipped. If only
            some fields are empty, the remaining fields will be stored as <code>null</code>.
          </li>
        </ul>
      </div>

      {/* Modal to display Excel format image */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Excel Format Example</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={excelImage} alt="Excel Format Example" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LeadUpload;

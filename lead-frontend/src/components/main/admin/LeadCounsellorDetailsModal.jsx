import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const LeadCounsellorDetailsModal = ({ showModal, handleClose, selectedLead }) => {
  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Lead and Counsellor Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedLead && (
          <>
            <h5>Lead Details</h5>
            <p><strong>Name:</strong> {selectedLead.lead_name}</p>
            <p><strong>Email:</strong> {selectedLead.lead_email}</p>
            <p><strong>Phone:</strong> {selectedLead.lead_phone}</p>
            <p><strong>Joining Status:</strong> {selectedLead.lead_joining_status ? 'Joined' : 'Not Joined'}</p>

            <h5 className="mt-4">Counsellor Details</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Assigned Date</th>
                  <th>Response</th>
                  <th>Interested</th>
                  <th>Active</th>
                  <th>Responsible for Joining</th>
                </tr>
              </thead>
              <tbody>
                {selectedLead.counsellors.map((counsellor) => (
                  <tr
                    key={counsellor.counsellor_id}
                    className={counsellor.is_active ? 'table-success' : ''}
                  >
                    <td>{counsellor.counsellor_name || 'N/A'}</td>
                    <td>{counsellor.counsellor_email}</td>
                    <td>{counsellor.counsellor_phone}</td>
                    <td>{new Date(counsellor.assigned_date).toLocaleDateString()}</td>
                    <td>{counsellor.response || 'N/A'}</td>
                    <td>{counsellor.is_interested ? 'Yes' : 'No'}</td>
                    <td>{counsellor.is_active ? 'Active' : 'Inactive'}</td>
                    <td>{counsellor.responsible_for_joining ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeadCounsellorDetailsModal;

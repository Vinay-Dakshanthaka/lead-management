import React, { useState, useEffect } from 'react';
import { Table, Form, Container, Pagination } from 'react-bootstrap';
import axios from 'axios';

const JoinedCandidatesTable = () => {
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [candidatesPerPage] = useState(5); // Number of candidates per page

    // Fetch joined candidates data on component mount
    useEffect(() => {
        axios.get('http://localhost:3003/api/lead/joined-leads') // Ensure you have this route returning only joined candidates
            .then(response => {
                setCandidates(response.data.leads);
            })
            .catch(error => {
                console.error('Error fetching joined candidates:', error);
            });
    }, []);

    // Handle search input
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1); // Reset to first page when searching
    };

    // Filter candidates based on search term (name, email, phone)
    const filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm) ||
        candidate.email.toLowerCase().includes(searchTerm) ||
        candidate.phone.includes(searchTerm)
    );

    // Get current candidates for the current page
    const indexOfLastCandidate = currentPage * candidatesPerPage;
    const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
    const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

    // Pagination controls
    const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container>
            <h2 className="mt-4">Joined Candidates</h2>

            {/* Search Input */}
            <Form.Group controlId="formSearch" className="my-4">
                <Form.Control
                    type="text"
                    placeholder="Search by name, email or phone number"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </Form.Group>

            {/* Candidates Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCandidates.length > 0 ? (
                        currentCandidates.map((candidate, index) => (
                            <tr key={candidate.lead_id}>
                                <td>{indexOfFirstCandidate + index + 1}</td>
                                <td>{candidate.name}</td>
                                <td>{candidate.email}</td>
                                <td>{candidate.phone}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No candidates found</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="justify-content-center">
                    <Pagination.First
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                    />
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    />
                    <Pagination.Last
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                    />
                </Pagination>
            )}
        </Container>
    );
};

export default JoinedCandidatesTable;

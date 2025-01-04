// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Pagination, Form, Button, Container } from "react-bootstrap";
// import { baseURL } from "../../config";

// const MessageStatusList = () => {
//     const [statuses, setStatuses] = useState([]);
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [totalPages, setTotalPages] = useState(0);
//     const [filters, setFilters] = useState({ status: "", recipient_id: "" });

//     useEffect(() => {
//         fetchMessageStatuses();
//     }, [page, limit, filters]);

//     const fetchMessageStatuses = async () => {
//         try {
//             const response = await axios.get(`${baseURL}/api/whatsappLeads/messageStatus/getAllMessageStatuses`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 },
//                 {
//                     params: {
//                         page,
//                         limit,
//                         ...filters
//                     },
//                 }
//             );

//             const { data, pagination } = response.data;
//             console.log(response.data)
//             setStatuses(data);
//             setTotalPages(pagination.totalPages);
//         } catch (error) {
//             console.error("Error fetching message statuses:", error);
//         }
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters({ ...filters, [name]: value });
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setPage(newPage);
//         }
//     };

//     return (
//         <Container>
//             <h1 className="my-4">Message Statuses</h1>

//             {/* Filters */}
//             <Form className="mb-4">
//                 <Form.Group controlId="filterStatus" className="mb-3">
//                     <Form.Label>Status</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Enter status (e.g., delivered, failed)"
//                         name="status"
//                         value={filters.status}
//                         onChange={handleFilterChange}
//                     />
//                 </Form.Group>

//                 <Form.Group controlId="filterRecipientId" className="mb-3">
//                     <Form.Label>Recipient ID</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Enter recipient ID"
//                         name="recipient_id"
//                         value={filters.recipient_id}
//                         onChange={handleFilterChange}
//                     />
//                 </Form.Group>

//                 <Button variant="primary" onClick={() => fetchMessageStatuses()}>
//                     Apply Filters
//                 </Button>
//             </Form>

//             {/* Table */}
//             <Table striped bordered hover responsive>
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Recipient ID</th>
//                         <th>Message ID</th>
//                         <th>Status</th>
//                         <th>Timestamp</th>
//                         <th>Error Code</th>
//                         <th>Error Title</th>
//                         <th>Error Message</th>
//                         <th>Error Details</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {statuses.map((status) => (
//                         <tr key={status.id}>
//                             <td>{status.id}</td>
//                             <td>{status.recipient_id}</td>
//                             <td>{status.message_id}</td>
//                             <td>{status.status}</td>
//                             <td>{new Date(status.timestamp * 1000).toLocaleString()}</td>
//                             <td>{status.error_code || "N/A"}</td>
//                             <td>{status.error_title || "N/A"}</td>
//                             <td>{status.error_message || "N/A"}</td>
//                             <td>{status.error_details || "N/A"}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             {/* Pagination */}
//             <Pagination className="justify-content-center">
//                 <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
//                 {[...Array(totalPages).keys()].map((num) => (
//                     <Pagination.Item
//                         key={num + 1}
//                         active={num + 1 === page}
//                         onClick={() => handlePageChange(num + 1)}
//                     >
//                         {num + 1}
//                     </Pagination.Item>
//                 ))}
//                 <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
//             </Pagination>
//         </Container>
//     );
// };

// export default MessageStatusList;


import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Table, Pagination, Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { debounce } from "lodash";
import { baseURL } from "../../config";

const MessageStatusList = () => {
    const [statuses, setStatuses] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({ status: "", recipient_id: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMessageStatuses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}/api/whatsappLeads/messageStatus/getAllMessageStatuses`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: { page, limit, ...filters },
            });

            const { data, pagination } = response.data;
            setStatuses(data);
            setTotalPages(pagination.totalPages);
        } catch (err) {
            setError("Failed to fetch data. Please try again.");
            console.error("Error fetching message statuses:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1); // Reset page on filter change
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) setPage(newPage);
    };

    const debouncedFetch = useMemo(
        () => debounce(fetchMessageStatuses, 500), // Avoid rapid API calls
        [page, limit, filters]
    );

    useEffect(() => {
        debouncedFetch();
        return () => debouncedFetch.cancel();
    }, [page, limit, filters]);

    const renderPagination = () => {
        const pagesToShow = 5; // Number of pages to show around the current page
        const startPage = Math.max(1, page - Math.floor(pagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

        const pageItems = [];
        for (let i = startPage; i <= endPage; i++) {
            pageItems.push(
                <Pagination.Item key={i} active={i === page} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        return (
            <>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                {pageItems}
                <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
            </>
        );
    };

    return (
        <Container>
            <h1 className="my-4">Message Statuses</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form className="mb-4">
                <Form.Group controlId="filterStatus" className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="read">Read</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
                        <option value="sent">Sent</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="filterRecipientId" className="mb-3">
                    <Form.Label>Recipient ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter recipient ID"
                        name="recipient_id"
                        value={filters.recipient_id}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
            </Form>

            {isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Recipient ID</th>
                            <th>Message ID</th>
                            <th>Status</th>
                            <th>Timestamp</th>
                            <th>Error Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.map((status) => (
                            <tr key={status.id}>
                                <td>{status.id}</td>
                                <td>{status.recipient_id}</td>
                                <td>{status.message_id}</td>
                                <td>{status.status}</td>
                                <td>{new Date(status.timestamp * 1000).toLocaleString()}</td>
                                <td>{status.error_details || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Pagination className="justify-content-center">{renderPagination()}</Pagination>
        </Container>
    );
};

export default MessageStatusList;


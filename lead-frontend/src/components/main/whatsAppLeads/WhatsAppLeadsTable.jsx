import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseURL } from "../../config";

const WhatsAppLeadsTable = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage] = useState(25);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeads = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found.");
            }
            const response = await axios.get(`${baseURL}/api/whatsappLeads/getAllWhatsAppLeads`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLeads(response.data.leads);
            setFilteredLeads(response.data.leads);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to fetch WhatsApp leads. Please try again later.");
            toast.error(err.message || "Failed to fetch WhatsApp leads. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setSearchTerm(search);
        const filtered = leads.filter((lead) =>
            Object.values(lead).some((value) =>
                String(value).toLowerCase().includes(search)
            )
        );
        setFilteredLeads(filtered);
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-5">
            <Toaster position="top-center" />
            <h3 className="mb-4 text-center">WhatsApp Leads</h3>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    No leads available.
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-primary">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Place</th>
                                    <th>District</th>
                                    <th>State</th>
                                    <th>PIN</th>
                                    <th>College</th>
                                    <th>University</th>
                                    <th>Qualification</th>
                                    <th>Year of Passout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLeads.map((lead, index) => (
                                    <tr key={lead.id}>
                                        <td>{indexOfFirstLead + index + 1}</td>
                                        <td>{lead.name}</td>
                                        <td>{lead.email}</td>
                                        <td>{lead.phone}</td>
                                        <td>{lead.place}</td>
                                        <td>{lead.district}</td>
                                        <td>{lead.state}</td>
                                        <td>{lead.pin}</td>
                                        <td>{lead.college}</td>
                                        <td>{lead.university}</td>
                                        <td>{lead.qualification}</td>
                                        <td>{lead.year_of_passout}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <nav>
                            <ul className="pagination mb-0">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
};

export default WhatsAppLeadsTable;

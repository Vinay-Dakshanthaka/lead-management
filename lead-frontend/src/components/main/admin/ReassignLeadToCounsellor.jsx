import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CounsellorSelect from './CounsellorSelect';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from '../../config';
import { FaExclamationTriangle } from 'react-icons/fa';
import Paginate from '../../common/Paginate';
import { Spinner } from 'react-bootstrap';

const ReassignLeadToCounsellor = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [selectedCounsellors, setSelectedCounsellors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token provided.');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${baseURL}/api/lead/get-lead-data`, config);
                setLeads(response.data.leads);
                setFilteredLeads(response.data.leads); // Initialize filtered leads
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch lead data');
                console.error('Error fetching leads:', error);
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    // Handle counsellor selection
    const handleCounsellorSelect = (leadId, counsellorId) => {
        setSelectedCounsellors((prevState) => ({
            ...prevState,
            [leadId]: counsellorId,
        }));
    };

    // Reassign lead to selected counsellor
    const handleReassignCounsellor = async (leadId) => {
        const selectedCounsellorId = selectedCounsellors[leadId];
        if (!selectedCounsellorId) {
            toast.error('Please select a counsellor before reassigning');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token provided.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${baseURL}/api/lead/reAssignLead`,
                {
                    lead_id: leadId,
                    counsellor_id: selectedCounsellorId,
                },
                config
            );

            toast.success('Counsellor reassigned successfully');

            // Update active counsellor data in UI
            setLeads((prevLeads) =>
                prevLeads.map((lead) =>
                    lead.lead_id === leadId
                        ? {
                              ...lead,
                              activeCounsellor: {
                                  name: response.data.counsellorName,
                                  counsellor_id: selectedCounsellorId,
                              },
                          }
                        : lead
                )
            );
        } catch (error) {
            toast.error('Failed to reassign counsellor');
            console.error('Error reassigning counsellor:', error);
        }
    };

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const term = e.target.value.toLowerCase();
        const filtered = leads.filter(
            (lead) =>
                lead.lead_name.toLowerCase().includes(term) ||
                lead.lead_email.toLowerCase().includes(term) ||
                lead.lead_phone.includes(term)
        );
        setFilteredLeads(filtered);
        setCurrentPage(1); // Reset to the first page
    };

    // Get current leads for pagination
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (!leads.length) return <div>No leads available</div>;

    return (
        <div className="container mt-4">
            <h2>Lead Data</h2>
            <input
                type="text"
                placeholder="Search by name, email, or phone"
                className="form-control mb-3"
                value={searchTerm}
                onChange={handleSearch}
            />
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Lead Name</th>
                        <th>Lead Email</th>
                        <th>Lead Phone</th>
                        <th>Active Counsellor</th>
                        <th>Select Counsellor</th>
                        <th>Reassign Counsellor</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLeads.map((lead) => (
                        <tr key={lead.lead_id}>
                            <td>{lead.lead_name}</td>
                            <td>{lead.lead_email}</td>
                            <td>{lead.lead_phone}</td>
                            <td>
                                {lead.activeCounsellor ? (
                                    lead.activeCounsellor.name || lead.activeCounsellor.email
                                ) : (
                                    <span className="badge badge-warning bg-warning">
                                        <FaExclamationTriangle fill="#ff0000" /> None
                                    </span>
                                )}
                            </td>
                            <td>
                                <CounsellorSelect
                                    onSelect={(counsellorId) =>
                                        handleCounsellorSelect(lead.lead_id, counsellorId)
                                    }
                                />
                            </td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleReassignCounsellor(lead.lead_id)}
                                >
                                    Reassign Counsellor
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Paginate
                currentPage={currentPage}
                totalItems={filteredLeads.length}
                itemsPerPage={leadsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ReassignLeadToCounsellor;

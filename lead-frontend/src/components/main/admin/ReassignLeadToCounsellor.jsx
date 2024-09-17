import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CounsellorSelect from './CounsellorSelect';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from '../../config';
import { FaExclamationTriangle } from 'react-icons/fa';

const ReassignLeadToCounsellor = () => {
    const [leads, setLeads] = useState([]);
    const [selectedCounsellors, setSelectedCounsellors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage] = useState(10); // Set leads per page
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch lead data from the API
        const fetchLeads = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("No token provided.");
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${baseURL}/api/lead/get-lead-data`, config);
                setLeads(response.data.leads);
            } catch (error) {
                toast.error('Failed to fetch lead data');
                console.error('Error fetching leads:', error);
            }
        };

        fetchLeads();
    }, []);

    // Handle counsellor selection
    const handleCounsellorSelect = (leadId, counsellorId) => {
        setSelectedCounsellors(prevState => ({
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
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token provided.");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            // Make API call to reassign the lead
            const response = await axios.post(`${baseURL}/api/lead/reAssignLead`, {
                lead_id: leadId,
                counsellor_id: selectedCounsellorId,
            }, config);

            toast.success('Counsellor reassigned successfully');

            // Update active counsellor data in UI without reload
            setLeads(prevLeads =>
                prevLeads.map(lead =>
                    lead.lead_id === leadId
                        ? { ...lead, activeCounsellor: { name: response.data.counsellorName, counsellor_id: selectedCounsellorId } }
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
        setCurrentPage(1); // Reset to first page on search
    };

    // Pagination logic
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;

    // Filter leads based on search term
    // Filter leads based on search term, with null checks
    const filteredLeads = leads.filter(lead =>
        (lead.lead_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (lead.lead_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (lead.lead_phone || '').includes(searchTerm)
    );


    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

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
                    {currentLeads.map(lead => (
                        <tr key={lead.lead_id}>
                            <td>{lead.lead_name}</td>
                            <td>{lead.lead_email}</td>
                            <td>{lead.lead_phone}</td>
                            {/* <td>{lead.activeCounsellor ? lead.activeCounsellor.name || lead.activeCounsellor.email : 'None'}</td> */}
                            <td>
                                {lead.activeCounsellor ?
                                    (lead.activeCounsellor.name || lead.activeCounsellor.email) :
                                    <span className="badge badge-warning bg-warning"><FaExclamationTriangle fill='#ff0000'/> None</span>
                                }
                            </td>
                            <td>
                                <CounsellorSelect
                                    onSelect={counsellorId => handleCounsellorSelect(lead.lead_id, counsellorId)}
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

            {/* Pagination */}
            <nav>
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(filteredLeads.length / leadsPerPage) }, (_, i) => i + 1).map(number => (
                        <li key={number} className="page-item">
                            <a onClick={() => paginate(number)} href="#!" className="page-link">
                                {number}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default ReassignLeadToCounsellor;
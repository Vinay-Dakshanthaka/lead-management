import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../../config";
import toast from "react-hot-toast";
import Paginate from "../../common/Paginate";

const CreateLeadGroup = () => {
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [leadIds, setLeadIds] = useState([]);
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 10;

    // Fetch leads data
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(
                    `${baseURL}/api/counsellor/getAllLeadsForCounsellorById`,
                    config
                );
                setLeads(response.data.leads);
                setFilteredLeads(response.data.leads);
            } catch (error) {
                toast.error("Failed to fetch lead data.");
            }
        };

        fetchLeads();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!groupName) {
            toast.warning("Group name is required.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                group_name: groupName,
                description,
                lead_ids: leadIds,
            };
            // console.log("payload :", payload)
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(`${baseURL}/api/leadGroup/createLeadGroup`, payload, config);
            toast.success("Lead group created successfully.");
            setGroupName("");
            setDescription("");
            setLeadIds([]);
        } catch (error) {
            // console.log(error,"-------------leadgroupform")
            const errorMessage =
                error.response?.data?.message || "Failed to create lead group.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle checkbox selection
    const handleCheckboxChange = (leadId) => {
        setLeadIds((prev) => {
            if (prev.includes(leadId)) {
                return prev.filter((id) => id !== leadId);
            } else {
                return [...prev, leadId];
            }
        });
    };

    // Handle master checkbox selection
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const currentLeadIds = filteredLeads.map((lead) => lead.lead_id);
            setLeadIds(currentLeadIds);
        } else {
            setLeadIds([]);
        }
    };

    // Filter leads by search query
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = leads.filter((lead) => {
            const name = lead.lead_name || "";
            const email = lead.lead_email || "";
            const phone = lead.lead_phone || "";
            return (
                name.toLowerCase().includes(lowercasedQuery) ||
                email.toLowerCase().includes(lowercasedQuery) ||
                phone.includes(lowercasedQuery)
            );
        });
        setFilteredLeads(filtered);
        setCurrentPage(1);
    }, [searchQuery, leads]);

    // Paginate leads for the current page
    const paginateLeads = () => {
        const indexOfLastLead = currentPage * leadsPerPage;
        const indexOfFirstLead = indexOfLastLead - leadsPerPage;
        return filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    };

    // Leads to be displayed on the current page
    const currentLeads = paginateLeads();

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mt-5">
            <h2>Create New Group</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="groupName" className="form-label">
                        Group Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description (Optional)
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Search Leads</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, email, or phone"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    {/* <label className="form-label">Select Leads</label> */}
                    {currentLeads.length > 0 ? (
                        <>
                            {/* <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="selectAll"
                                    checked={
                                        leadIds.length > 0 &&
                                        leadIds.length === filteredLeads.length
                                    }
                                    onChange={handleSelectAll}
                                />
                                <label htmlFor="selectAll" className="form-check-label">
                                    Select All
                                </label>
                            </div> */}
                            <table className="table table-striped table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="selectAll"
                                                    checked={
                                                        leadIds.length > 0 &&
                                                        leadIds.length === filteredLeads.length
                                                    }
                                                    onChange={handleSelectAll}
                                                />
                                                <label htmlFor="selectAll" className="form-check-label">
                                                    Select All
                                                </label>
                                            </div>
                                        </th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Joining Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentLeads.map((lead) => (
                                        <tr key={lead.lead_id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={leadIds.includes(lead.lead_id)}
                                                    onChange={() => handleCheckboxChange(lead.lead_id)}
                                                />
                                            </td>
                                            <td>{lead.lead_name}</td>
                                            <td>{lead.lead_email}</td>
                                            <td>{lead.lead_phone}</td>
                                            <td>
                                                {lead.lead_joining_status ? "Joined" : "Not Joined"}
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
                        </>
                    ) : (
                        <p>No leads available.</p>
                    )}
                </div>
            </form>
            <button
                type="submit"
                className="btn btn-primary m-3"
                disabled={loading}
                onClick={handleSubmit}
            >
                {loading ? "Creating..." : "Create Group"}
            </button>
        </div>
    );
};

export default CreateLeadGroup;

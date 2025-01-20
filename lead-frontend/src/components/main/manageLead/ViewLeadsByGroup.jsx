import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { baseURL } from "../../config";
import Paginate from "../../common/Paginate";

const ViewLeadsByGroup = () => {
  const location = useLocation();
  const { group } = location.state || {};

  const [notAssignedLeads, setNotAssignedLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeads = async () => {
      if (!group) return;

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        setLoading(true);
        setError("");

        const allLeadsResponse = await axios.get(`${baseURL}/api/leadGroup/getAllLeads`, config);
        const allLeads = Array.isArray(allLeadsResponse.data.leads) ? allLeadsResponse.data.leads : [];

        const groupLeadsResponse = await axios.get(`${baseURL}/api/leadGroup/getLeadsByGroup`, {
          params: { group_id: group.group_id },
          ...config,
        });
        const groupLeads = Array.isArray(groupLeadsResponse.data.leads) ? groupLeadsResponse.data.leads : [];

        const leadsNotInGroup = allLeads.filter(
          (lead) => !groupLeads.some((groupLead) => groupLead.lead_id === lead.lead_id)
        );

        setNotAssignedLeads(leadsNotInGroup);
        setFilteredLeads(leadsNotInGroup);
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Failed to fetch leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [group]);

  const handleCheckboxChange = (leadId) => {
    setSelectedLeads((prevSelected) =>
      prevSelected.includes(leadId)
        ? prevSelected.filter((id) => id !== leadId)
        : [...prevSelected, leadId]
    );
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = notAssignedLeads.filter(
      (lead) =>
        lead.email.toLowerCase().includes(term) || (lead.phone && lead.phone.toLowerCase().includes(term))
    );
    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        group_id: group.group_id,
        group_name: group.group_name,
        description: group.description,
        lead_ids: selectedLeads,
      };

      await axios.post(`${baseURL}/api/lead/addtothegroup`, payload, config);
      alert("Selected leads successfully added to the group.");
      setSelectedLeads([]);
    } catch (err) {
      console.error("Error adding leads to the group:", err);
      alert("Failed to add leads to the group. Please try again later.");
    }
  };

  const paginateLeads = () => {
    const indexOfLastLead = currentPage * itemsPerPage;
    const indexOfFirstLead = indexOfLastLead - itemsPerPage;
    return filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!group) {
    return <p>No group data available. Please navigate from the appropriate page.</p>;
  }

  const paginatedLeads = paginateLeads();

  return (
    <div className="container mt-4">
      <h3>Group Name: {group.group_name}</h3>

      {loading && <p>Loading leads...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="mt-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by email or phone number"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <h4>Leads Not Assigned to This Group:</h4>
      <button
        className="btn btn-primary mt-3"
        onClick={handleSubmit}
        disabled={selectedLeads.length === 0}
      >
        Add Selected Leads to Group
      </button>

      {filteredLeads.length > 0 ? (
        <>
          <table className="table table-sm table-bordered mt-3">
            <thead>
              <tr>
                <th>Select</th>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead, index) => (
                <tr key={lead.lead_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.lead_id)}
                      onChange={() => handleCheckboxChange(lead.lead_id)}
                    />
                  </td>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone || "N/A"}</td>
                  <td>{lead.status || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Paginate
            currentPage={currentPage}
            totalItems={filteredLeads.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p>No unassigned leads available.</p>
      )}
    </div>
  );
};

export default ViewLeadsByGroup;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const CreateLeadGroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [leadIds, setLeadIds] = useState([]);
  const [leads, setLeads] = useState([]);

  // Fetch leads for the multi-select dropdown
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("/api/leads");
        setLeads(response.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads");
      }
    };

    fetchLeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      group_name: groupName,
      description,
      lead_ids: leadIds,
    };

    try {
      const response = await axios.post("/api/lead-groups", payload);
      toast.success(response.data.message);
      // Reset the form
      setGroupName("");
      setDescription("");
      setLeadIds([]);
    } catch (error) {
      console.error("Error creating lead group:", error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create lead group");
      }
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-xl font-bold mb-4">Create New Lead Group</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="groupName" className="block font-medium mb-1">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="leadIds" className="block font-medium mb-1">
            Assign Leads
          </label>
          <select
            id="leadIds"
            value={leadIds}
            onChange={(e) =>
              setLeadIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            multiple
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateLeadGroupForm;

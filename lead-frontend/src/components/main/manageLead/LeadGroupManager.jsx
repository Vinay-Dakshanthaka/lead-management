import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL } from "../../config";
import CreateLeadGroup from "../admin/LeadGroupForm";

const LeadGroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({ group_name: "", description: "" });
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${baseURL}/api/leadGroup/getAllLeadGroups`, config);
      setGroups(response.data.groups || []);
      console.log(response.data.groups)
    } catch (error) {
      console.log(error,"----------------")
      toast.error(error.response?.data?.message || "Failed to fetch groups.");
    } finally {
      setLoading(false);
    }
  };

  // Update group
  const updateGroup = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${baseURL}/api/leadGroup/updateLeadGroup`, formData);
      toast.success(response.data.message || "Group updated successfully!");
      fetchGroups();
      setSelectedGroup(null);
      setFormData({ group_name: "", description: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update group.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle edit
  const handleEdit = (group) => {
    setSelectedGroup(group);
    setFormData({ group_name: group.group_name, description: group.description });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateGroup();
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lead Group Manager</h2>
      <div className="row">
        {/* Group List */}
        <div className="col-md-6">
          <h4>Groups</h4>
          {loading && <p>Loading groups...</p>}
          <ul className="list-group">
            {groups.map((group) => (
              <li
                key={group.group_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{group.group_name}</strong>
                  <p className="mb-0">{group.description}</p>
                  <p className="text-muted small mb-0">
                    <strong>Created by:</strong> {group.Creator?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(group)}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Group Form */}
        <div className="col-md-6">
          <h4>Edit Group</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="group_name" className="form-label">
                Group Name
              </label>
              <input
                type="text"
                className="form-control"
                id="group_name"
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                required
                disabled={true} // Always disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={!selectedGroup} // Disabled until a group is selected
              />
            </div>
            <button
              type="submit"
              className="btn btn-success"
              disabled={!selectedGroup || loading} // Disabled if no group selected or loading
            >
              {loading ? "Updating..." : "Update Group Details"}
            </button>
          </form>
        </div>
      </div>
      <CreateLeadGroup />
    </div>
  );
};

export default LeadGroupManager;

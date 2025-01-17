import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL } from "../../config";
import CreateLeadGroup from "../admin/LeadGroupForm";
import GroupDetails from "../groups/GroupDetails";

const LeadGroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({ group_name: "", description: "" });
  const [loading, setLoading] = useState(false); // Loading state

  const [leadGroups, setLeadGroups] = useState([]);
  const [error, setError] = useState(null);

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
    } catch (error) {
      console.log(error, "----------------")
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

  const fetchLeadGroupsByCreator = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${baseURL}/api/leadGroup/getLeadGroupsByCreator`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead groups:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadLeadGroups = async () => {
      try {
        const groups = await fetchLeadGroupsByCreator();
        setLeadGroups(groups);
      } catch (err) {
        setError(err.message);
      }
    };

    loadLeadGroups();
  }, []);

  if (error) return <p>Error: {error}</p>;

  // Show a loading message if `leadGroups` is still null
  if (leadGroups === null) return <p>Loading...</p>;

  return (
    <>
      <div className="container my-4">
        <h2 className="text-center">Lead Groups</h2>
        <div className="row">
          {/* Group List */}
          <div className="col-md-6 mb-4">
            {leadGroups.length === 0 ? (
              <p className="text-center">No lead groups found.</p>
            ) : (
              <ul className="list-group">
                {leadGroups.map((group) => (
                  <li
                    key={group.group_id}
                    className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3"
                  >
                    <div className="mb-2 mb-md-0">
                      <h4>{group.group_name}</h4>
                      <p className="mb-1">
                        <strong>Description:</strong> {group.description || "No description available"}
                      </p>
                      <p className="text-muted small mb-1">
                        <strong>Created By:</strong> {group.Creator?.name || "Unknown"}
                      </p>
                      <p>
                        <strong>Active:</strong> {group.is_active ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(group)}
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Edit Group Form */}
          <div className="col-md-6">
            <h4>Edit Group</h4>
            <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-white rounded">
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
                className="btn btn-success w-100"
                disabled={!selectedGroup || loading} // Disabled if no group selected or loading
              >
                {loading ? "Updating..." : "Update Group Details"}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-4">
          <CreateLeadGroup />
        </div>
        <GroupDetails />
      </div>
    </>

  );
};

export default LeadGroupManager;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaSave } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { baseURL } from "../../config";

const SaveAdminConfig = () => {
  const [formData, setFormData] = useState({
    whatsapp_token: "",
    check_token: "",
    business_id: "",
    app_id: "",
    phone_number_id: "",
    email_username: "",
    email_password: "",
    client_name: "",
  });
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${baseURL}/api/admin/super-admin/admin-details`, config);
        const filteredAdmins = response.data.counsellors.filter(
          (admin) => admin.adminconfig.length === 0
        );
        setAdmins(filteredAdmins);
      } catch (error) {
        toast.error("Failed to fetch admin details.");
      }
    };

    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) {
      toast.error("Please select an admin.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${baseURL}/api/admin/adminConfig/saveAdminConfig`,
        { ...formData, admin_id: selectedAdmin },
        config
      );
      toast.success(response.data.message);
      setFormData({
        whatsapp_token: "",
        check_token: "",
        business_id: "",
        app_id: "",
        phone_number_id: "",
        email_username: "",
        email_password: "",
        client_name: "",
      });
      setSelectedAdmin(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to save configuration.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <Toaster />
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <FaSave className="me-2" /> Save Admin Configuration
          </div>
          <div className="card-body">
            <h5>Select Admin / Client </h5>
            <div className="mb-3">
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <div key={admin.counsellor_id} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="admin"
                      id={`admin-${admin.counsellor_id}`}
                      value={admin.counsellor_id}
                      checked={selectedAdmin === admin.counsellor_id}
                      onChange={() => setSelectedAdmin(admin.counsellor_id)}
                    />
                    <label className="form-check-label" htmlFor={`admin-${admin.counsellor_id}`}>
                      {admin.name || "Unnamed Admin"} ({admin.email})
                    </label>
                  </div>
                ))
              ) : (
                <p>No admins available without configuration.</p>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((key) => (
                <div className="mb-3" key={key}>
                  <label htmlFor={key} className="form-label">
                    {key.replace(/_/g, " ").toUpperCase()}
                    <AiOutlineInfoCircle
                      className="text-muted ms-2"
                      title={getInfoTooltip(key)}
                    />
                  </label>
                  <input
                    type={key.includes("password") ? "password" : "text"}
                    className="form-control"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading || !selectedAdmin}
              >
                {loading ? "Saving..." : <><FaSave className="me-2" /> Save Configuration</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveAdminConfig;

function getInfoTooltip(key) {
  switch (key) {
    case "whatsapp_token":
      return "The access token provided by the Meta/Facebook developer dashboard for a created app.";
    case "check_token":
      return "The check token configured for the webhook. Ensure this matches the token used in the webhook configuration.";
    case "business_id":
      return "The Business ID provided by the Meta/Facebook developer dashboard.";
    case "app_id":
      return "The App ID provided by the Meta/Facebook developer dashboard.";
    case "phone_number_id":
      return "The Phone Number ID provided by the Meta/Facebook developer dashboard.";
    case "email_username":
      return "The email address from which emails will be sent, typically a domain email.";
    case "email_password":
      return "The password for the email account used for sending emails.";
    case "client_name":
      return "The client name for identification and display once the admin is logged in, enhancing user experience.";
    default:
      return "";
  }
}

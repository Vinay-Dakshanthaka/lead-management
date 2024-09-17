import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { baseURL } from '../../config';

const UpdateLeadForm = ({ lead_id, counsellor_id, closeModal }) => {
    const [formData, setFormData] = useState({
        assigned_date: '',
        response: '',
        is_interested: false,
        contacted_date: '',
        next_contact_date: '',
        lead_name: '',
        lead_email: '',
        lead_phone: '',
        lead_joining_status: false,
        responsible_for_joining: false
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeadDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("No token provided.");
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.post(`${baseURL}/api/lead/getLeadDetails`, { lead_id, counsellor_id }, config);
                const leadData = response.data.leadDetails;

                // Populate form with existing lead details
                setFormData({
                    assigned_date: leadData.LeadCounsellors[0].assigned_date || '',
                    response: leadData.LeadCounsellors[0].response || '',
                    is_interested: leadData.LeadCounsellors[0].is_interested || false,
                    contacted_date: leadData.LeadCounsellors[0].contacted_date || '',
                    next_contact_date: leadData.LeadCounsellors[0].next_contact_date || '',
                    lead_name: leadData.name || '',
                    lead_email: leadData.email || '',
                    lead_phone: leadData.phone || '',
                    lead_joining_status: leadData.joining_status || false,
                    responsible_for_joining: leadData.LeadCounsellors[0].responsible_for_joining || false
                });
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch lead details");
            }
        };

        fetchLeadDetails();
    }, [lead_id, counsellor_id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No token provided.");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`${baseURL}/api/lead/updateLeadDetails`, { lead_id, counsellor_id, ...formData }, config);
            toast.success(response.data.message);
            closeModal(); // Close modal on successful update
        } catch (error) {
            toast.error("Failed to update lead details");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <form onSubmit={handleSubmit}>
            {/* Assigned Date */}
            <div className="mb-3">
                <label htmlFor="assigned_date" className="form-label">Assigned Date</label>
                <input
                    type="text"
                    className="form-control"
                    id="assigned_date"
                    name="assigned_date"
                    value={new Date(formData.assigned_date).toLocaleString()} // Display the date and time
                    readOnly
                />
            </div>
            
            {/* Lead Name */}
            <div className="mb-3">
                <label htmlFor="lead_name" className="form-label">Lead Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="lead_name"
                    name="lead_name"
                    value={formData.lead_name}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Lead Email */}
            <div className="mb-3">
                <label htmlFor="lead_email" className="form-label">Lead Email</label>
                <input
                    type="email"
                    className="form-control"
                    id="lead_email"
                    name="lead_email"
                    value={formData.lead_email}
                    onChange={handleInputChange}
                />
            </div>

            {/* Lead Phone */}
            <div className="mb-3">
                <label htmlFor="lead_phone" className="form-label">Lead Phone</label>
                <input
                    type="text"
                    className="form-control"
                    id="lead_phone"
                    name="lead_phone"
                    value={formData.lead_phone}
                    onChange={handleInputChange}
                />
            </div>

            {/* Joining Status */}
            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="lead_joining_status"
                    name="lead_joining_status"
                    checked={formData.lead_joining_status}
                    onChange={handleInputChange}
                />
                <label htmlFor="lead_joining_status" className="form-check-label">Joining Status</label>
            </div>

            {/* Response */}
            <div className="mb-3">
                <label htmlFor="response" className="form-label">Response</label>
                <textarea
                    className="form-control"
                    id="response"
                    name="response"
                    value={formData.response}
                    onChange={handleInputChange}
                />
            </div>

            {/* Is Interested */}
            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="is_interested"
                    name="is_interested"
                    checked={formData.is_interested}
                    onChange={handleInputChange}
                />
                <label htmlFor="is_interested" className="form-check-label">Is Interested</label>
            </div>

            {/* Contacted Date */}
            <div className="mb-3">
                <label htmlFor="contacted_date" className="form-label">Contacted Date</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    id="contacted_date"
                    name="contacted_date"
                    value={formData.contacted_date ? new Date(formData.contacted_date).toISOString().slice(0,16) : ''}
                    onChange={handleInputChange}
                />
            </div>

            {/* Next Contact Date */}
            <div className="mb-3">
                <label htmlFor="next_contact_date" className="form-label">Next Contact Date</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    id="next_contact_date"
                    name="next_contact_date"
                    value={formData.next_contact_date ? new Date(formData.next_contact_date).toISOString().slice(0,16) : ''}
                    onChange={handleInputChange}
                />
            </div>

            {/* Responsible for Joining */}
            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="responsible_for_joining"
                    name="responsible_for_joining"
                    checked={formData.responsible_for_joining}
                    onChange={handleInputChange}
                />
                <label htmlFor="responsible_for_joining" className="form-check-label">Responsible for Joining</label>
            </div>

            <button type="submit" className="btn btn-primary">Update Lead</button>
        </form>
    );
};

export default UpdateLeadForm;

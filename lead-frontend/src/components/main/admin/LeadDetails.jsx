import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import toast from 'react-hot-toast';

const LeadDetails = ({ selectedImage, templateName, templateLanguage }) => {
  const [leads, setLeads] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [messageStatus, setMessageStatus] = useState({}); // Track message status for each lead
  const [messageCount, setMessageCount] = useState({}); // Track message count per lead

  // Fetch leads and message count on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
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
        // Initialize messageCount for each lead
        const initialCounts = {};
        response.data.leads.forEach((lead) => {
          initialCounts[lead.lead_id] = lead.msg_count || 0;
        });
        setMessageCount(initialCounts);

        // Fetch message count for the given template and lead_id
        for (const lead of response.data.leads) {
          await fetchMessageCount(templateName, lead.lead_id);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to fetch leads');
      }
    };

    fetchLeads();
  }, [templateName]); // Fetch leads whenever templateName changes

  // Function to fetch message count for a specific template and lead_id
  const fetchMessageCount = async (template, leadId) => {
    try {
      const response = await axios.get(
        `http://localhost:3004/api/leadMessageHistory/count/${template}/${leadId}`
      );
      console.log(response.data, "------responsedata");
      if (response.data.success) {
        // Update the message count for the current template and lead_id
        setMessageCount((prevState) => ({
          ...prevState,
          [`${template}_${leadId}`]: response.data.total_sent_count,
        }));
      } else {
        toast.error('Failed to fetch message count');
      }
    } catch (error) {
      console.error('Error fetching message count:', error);
      toast.error('Error fetching message count');
    }
  };

  const handleSelectAll = () => {
    setAllSelected(!allSelected);
    if (!allSelected) {
      setSelectedLeads(leads.map((lead) => lead.lead_id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter((id) => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  const updateMessageHistory = async (leadId, templateName) => {
    try {
      await axios.post(
        `http://localhost:3004/api/leadMessageHistory/createLeadMessageHistory`,
        {
          lead_id: leadId,
          template_name: templateName,
          message_status: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to update message history:', error);
      toast.error('Failed to update message history');
    }
  };

  const sendMessage = async (lead) => {
    const { lead_phone, lead_name, lead_id } = lead;
    const to = `91${lead_phone}`;
    const payload = {
      to,
      templateName: templateName,
      languageCode: templateLanguage,
      imageUrl: selectedImage,
      userName: lead_name,
      websiteLink: 'https://lara.co.in',
    };

    try {
      let response;
      if (templateName === 'lara_jan2025_batch') {
        response = await axios.post(
          `${baseURL}/api/whatsapp/sendLaraJan2025BatchTemplate`,
          { to, templateName, languageCode: templateLanguage, imageUrl: selectedImage },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      } else if (templateName === 'video_template') {
        response = await axios.post(
          `${baseURL}/api/whatsapp/sendVideoTemplate`,
          { to, templateName, languageCode: templateLanguage, videoUrl: selectedImage },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      } else {
        response = await axios.post(
          `${baseURL}/api/whatsapp/sendMediaTemplateWithButton`,
          payload,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      }

      setMessageStatus((prev) => ({
        ...prev,
        [lead_id]: 'success',
      }));
      toast.success(`Message sent to ${lead_name}`);

      // Update Message History
      await updateMessageHistory(lead_id, templateName, to);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageStatus((prev) => ({
        ...prev,
        [lead_id]: 'failure',
      }));
      toast.error(`Failed to send message to ${lead_name}`);
    }
  };

  const sendMessagesToSelected = async () => {
    for (const leadId of selectedLeads) {
      const lead = leads.find((l) => l.lead_id === leadId);
      if (lead) {
        await sendMessage(lead);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Lead Details</h3>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={sendMessagesToSelected}
          disabled={selectedLeads.length === 0}
        >
          Send Message to Selected
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joining Status</th>
              <th>Actions</th>
              <th>Status</th>
              <th>Msg_SentCount</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.lead_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.lead_id)}
                      onChange={() => handleSelectLead(lead.lead_id)}
                    />
                  </td>
                  <td>{lead.lead_name}</td>
                  <td>{lead.lead_email}</td>
                  <td>{lead.lead_phone}</td>
                  <td>{lead.lead_joining_status ? 'Joined' : 'Not Joined'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => sendMessage(lead)}
                    >
                      Send Message
                    </button>
                  </td>
                  <td>
                    {messageStatus[lead.lead_id] === 'success' && (
                      <span className="text-success">✔️ Sent</span>
                    )}
                    {messageStatus[lead.lead_id] === 'failure' && (
                      <span className="text-danger">❌ Failed</span>
                    )}
                  </td>
                  <td>
                    {/* Display the message count for the current template and lead */}
                    {messageCount[`${templateName}_${lead.lead_id}`] || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No leads available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadDetails;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import toast from 'react-hot-toast';

const LeadDetails = ({ selectedImage, template}) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [leads, setLeads] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [messageStatus, setMessageStatus] = useState({});

  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
  const [messageSent, setMessageSent] = useState(false); // To track message sent status
  const [hasAttemptedSend, setHasAttemptedSend] = useState(false);

  const isBodyPresent = template.components.some(components => components.type === 'BODY');
  let parameterCount = 0;
  let textBody ;
    console.log(template,"-----------template")
  // Fetch groups on component load
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${baseURL}/api/leadGroup/getAllLeadGroups`, config);
        setGroups(response.data.groups);       
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to fetch groups');
      }
    };

    fetchGroups();
  }, []);

  // Fetch leads when a group is selected
  useEffect(() => {
    const fetchLeadsByGroup = async () => {
      if (!selectedGroup) return;
    
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        const response = await axios.get(
          `${baseURL}/api/leadGroup/getLeadsByGroup`,
          {
            params: { group_id: selectedGroup },
            ...config,
          }
        );
    
        setLeads(Array.isArray(response.data.leads) ? response.data.leads : []);
      } catch (error) {
        console.error('Error fetching leads by group:', error);
        toast.error('Failed to fetch leads by group');
      }
    };
    

    fetchLeadsByGroup();
  }, [selectedGroup]);

  const sendMessage = async (lead) => {
    console.log("Lead details:", lead);
    
    // Extract lead information
    const { phone, name } = lead;
    const to = `91${phone}`; // Format phone number to include country code
     console.log(to,"---------------to")
    if (isBodyPresent) {
      // Find the BODY component
      const bodyComponent = template.components.find(component => component.type === 'BODY');
    
      // Ensure the BODY component exists and has text
      if (bodyComponent && bodyComponent.text) {
         textBody = bodyComponent.text;
        // console.log(text, "---------------------------");
    
        // Use a regular expression to match all {{}} patterns (parameters like {{1}}, {{2}}, etc.)
        const matches = textBody.match(/{{\d+}}/g); // Matches all instances of {{number}}
    
        // Count the matches (parameters)
        parameterCount = matches ? matches.length : 0;
    
      } else {
      }
    } else {
    }
      // Prepare the payload for sending
      const payload = {
        to,
        templateName: template.name,           // Template name from `template` prop
        languageCode: template.language,      // Template language from `template` prop
        userName: name,                       // Lead name to personalize message
        mediaUrl: selectedImage,              // The media (image or video)
        parameterCount,
        textBody,
        websiteLink: 'https://lara.co.in',    // Default website link
      };

    // Send the media template
    try {
      console.log("Sending message to phone:", to);
      const response = await axios.post(
        `${baseURL}/api/whatsapp/sendMediaTemplate`, 
        { ...payload },  // Pass all the payload data
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update message status as success
      setMessageStatus((prev) => ({
        ...prev,
        [lead.lead_id]: 'success',
      }));

      // Show success toast
      toast.success(`Message sent to ${name}`);
    } catch (error) {
      console.error('Error sending message:', error);

      // Update message status as failure
      setMessageStatus((prev) => ({
        ...prev,
        [lead.lead_id]: 'failure',
      }));

      // Show error toast
      toast.error(`Failed to send message to ${name}`);
    }
};



  const handleSelectAll = () => {
    setAllSelected(!allSelected);
    setSelectedLeads(!allSelected ? leads.map((lead) => lead.lead_id) : []);
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };


  const sendMessagesToSelected = async () => {
    for (const leadId of selectedLeads) {
      const lead = leads.find((l) => l.lead_id === leadId);
      if (lead) {
        await sendMessage(lead);
      }
    }
  };

   const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSendMessage = async () => {
    setHasAttemptedSend(true); // Mark that the send button was clicked
    if (phoneNumber) {
      try {
        const to = phoneNumber;
        const lead = { phone: to, name: "Custom Lead" };

        await sendMessage(lead); 
        setMessageSent(true);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessageSent(false);
      }
    } else {
      setMessageSent(false); // Handle cases where phoneNumber is empty
    }
  };

  return (
    <div className="container mt-5">
            {/* Input field for phone number */}
            <input
        type="text"
        className="form-control"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={handlePhoneChange}
      />

      {/* Send Message Button */}
      <button className="btn btn-success mt-3" onClick={handleSendMessage}>
        Send Message
      </button>    
      <h3 className="mb-4">Lead Details</h3>
      
      {/* Group Filter */}
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedGroup || ''}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="" disabled>
            Select Group
          </option>
          {groups.map((group) => (
            <option key={group.group_id} value={group.group_id}>
              {group.group_name}
            </option>
          ))}
        </select>
      </div>

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
            </tr>
          </thead>
          <tbody>
          {leads.length > 0 ? (
  leads.map((lead) => {
    if (!lead) return null; // Skip invalid leads
    return (
      <tr key={lead.lead_id}>
        <td>
          <input
            type="checkbox"
            checked={selectedLeads.includes(lead.lead_id)}
            onChange={() => handleSelectLead(lead.lead_id)}
          />
        </td>
        <td>{lead.name}</td>
        <td>{lead.email}</td>
        <td>{lead.phone}</td>
        <td>{lead.joining_status ? 'Joined' : 'Not Joined'}</td>
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
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan="7" className="text-center">
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

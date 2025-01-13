// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { baseURL } from '../../config';
// import toast from 'react-hot-toast';

// const LeadDetails = ({ selectedImage, templateName, templateLanguage }) => {

//   const [leads, setLeads] = useState([]);
//   const [allSelected, setAllSelected] = useState(false);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [messageStatus, setMessageStatus] = useState({}); // Track message status for each lead

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(
//           `${baseURL}/api/counsellor/getAllLeadsForCounsellorById`,
//           config
//         );

//         setLeads(response.data.leads);
//       } catch (error) {
//         console.error('Error fetching leads:', error);
//         toast.error('Failed to fetch leads');
//       }
//     };

//     fetchLeads();
//   }, []);

//   const handleSelectAll = () => {
//     setAllSelected(!allSelected);
//     if (!allSelected) {
//       setSelectedLeads(leads.map((lead) => lead.lead_id));
//     } else {
//       setSelectedLeads([]);
//     }
//   };

//   const handleSelectLead = (leadId) => {
//     if (selectedLeads.includes(leadId)) {
//       setSelectedLeads(selectedLeads.filter((id) => id !== leadId));
//     } else {
//       setSelectedLeads([...selectedLeads, leadId]);
//     }
//   };

//   const sendMessage = async (lead) => {
//     const { lead_phone, lead_name } = lead;
//     const to = `91${lead_phone}`;
//     const payload = {
//       to,
//       templateName: templateName,
//       languageCode: templateLanguage,
//       imageUrl: selectedImage, 
//       userName: lead_name,
//       websiteLink: 'https://lara.co.in',
//     };

//     if(templateName === 'lara_jan2025_batch' || templateName === 'sunday_logical_reasoning_free_sessions'  || templateName === 'join_our_channel'){
//       const laraTemplatepayload = {
//         to,
//         templateName: templateName, 
//         languageCode: templateLanguage, 
//         imageUrl: selectedImage, 
//         // userName: lead_name,
//         // websiteLink: 'https://lara.co.in',
//       };

//       try {
//         const response = await axios.post(
//           `${baseURL}/api/whatsapp/sendLaraJan2025BatchTemplate`,
//           laraTemplatepayload,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );
//         console.log("to phone ", to)
//         setMessageStatus((prev) => ({
//           ...prev,
//           [lead.lead_id]: 'success',
//         }));
//         toast.success(`Message sent to ${lead_name}`);
//       } catch (error) {
//         console.error('Error sending message:', error);
//         setMessageStatus((prev) => ({
//           ...prev,
//           [lead.lead_id]: 'failure',
//         }));
//         toast.error(`Failed to send message to ${lead_name}`);
//       }
//     }else if(templateName === 'video_template'){
//       const laraTemplatepayload = {
//         to,
//         templateName: templateName, 
//         languageCode: templateLanguage, 
//         videoUrl: selectedImage, 
//         // userName: lead_name,
//         // websiteLink: 'https://lara.co.in',
//       };

//       try {
//         const response = await axios.post(
//           `${baseURL}/api/whatsapp/sendVideoTemplate`,
//           laraTemplatepayload,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );
//         // console.log("to phone ", to)
//         setMessageStatus((prev) => ({
//           ...prev,
//           [lead.lead_id]: 'success',
//         }));
//         toast.success(`Message sent to ${lead_name}`);
//       } catch (error) {
//         console.error('Error sending message:', error);
//         setMessageStatus((prev) => ({
//           ...prev,
//           [lead.lead_id]: 'failure',
//         }));
//         toast.error(`Failed to send message to ${lead_name}`);
//       }
//     }else{
//       try {
//         console.log("to phone ", to)
//         const response = await axios.post(
//           `${baseURL}/api/whatsapp/sendMediaTemplateWithButton`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );
       
//         setMessageStatus((prev) => ({
//           ...prev,
//           [lead.lead_id]: 'success',
//         }));
//         toast.success(`Message sent to ${lead_name}`);
//       } catch (error) {
//         console.error('Error sending message:', error);
//         setMessageStatus((prev) => ({
//           ...prev,
//           [lead.lead_id]: 'failure',
//         }));
//         toast.error(`Failed to send message to ${lead_name}`);
//       }
//     }

//   };


//   const sendMessagesToSelected = async () => {
//     for (const leadId of selectedLeads) {
//       const lead = leads.find((l) => l.lead_id === leadId);
//       if (lead) {
//         await sendMessage(lead);
//       }
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3 className="mb-4">Lead Details</h3>
//       <div className="d-flex justify-content-end mb-3">
//         <button
//           className="btn btn-primary"
//           onClick={sendMessagesToSelected}
//           disabled={selectedLeads.length === 0}
//         >
//           Send Message to Selected
//         </button>
//       </div>
//       <div className="table-responsive">
//         <table className="table table-striped table-bordered">
//           <thead className="thead-dark">
//             <tr>
//               <th>
//                 <input
//                   type="checkbox"
//                   checked={allSelected}
//                   onChange={handleSelectAll}
//                 />
//               </th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Joining Status</th>
//               <th>Actions</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leads.length > 0 ? (
//               leads.map((lead) => (
//                 <tr key={lead.lead_id}>
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={selectedLeads.includes(lead.lead_id)}
//                       onChange={() => handleSelectLead(lead.lead_id)}
//                     />
//                   </td>
//                   <td>{lead.lead_name}</td>
//                   <td>{lead.lead_email}</td>
//                   <td>{lead.lead_phone}</td>
//                   <td>{lead.lead_joining_status ? 'Joined' : 'Not Joined'}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-success"
//                       onClick={() => sendMessage(lead)}
//                     >
//                       Send Message
//                     </button>
//                   </td>
//                   <td>
//                     {messageStatus[lead.lead_id] === 'success' && (
//                       <span className="text-success">✔️ Sent</span>
//                     )}
//                     {messageStatus[lead.lead_id] === 'failure' && (
//                       <span className="text-danger">❌ Failed</span>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center">
//                   No leads available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default LeadDetails;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import toast from 'react-hot-toast';

const LeadDetails = ({ selectedImage, templateName, templateLanguage }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [leads, setLeads] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [messageStatus, setMessageStatus] = useState({});

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
    console.log("leads details : ", lead)
        const { phone, name } = lead;
        const to = `91${phone}`;
        const payload = {
          to,
          templateName: templateName,
          languageCode: templateLanguage,
          imageUrl: selectedImage, 
          userName: name,
          websiteLink: 'https://lara.co.in',
        };
    
        if(templateName === 'lara_jan2025_batch' || templateName === 'sunday_logical_reasoning_free_sessions'  || templateName === 'join_our_channel'){
          const laraTemplatepayload = {
            to,
            templateName: templateName, 
            languageCode: templateLanguage, 
            imageUrl: selectedImage, 
            // userName: lead_name,
            // websiteLink: 'https://lara.co.in',
          };
    
          try {
            const response = await axios.post(
              `${baseURL}/api/whatsapp/sendLaraJan2025BatchTemplate`,
              laraTemplatepayload,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            console.log("to phone ", to)
            setMessageStatus((prev) => ({
              ...prev,
              [lead.lead_id]: 'success',
            }));
            toast.success(`Message sent to ${lead_name}`);
          } catch (error) {
            console.error('Error sending message:', error);
            setMessageStatus((prev) => ({
              ...prev,
              [lead.lead_id]: 'failure',
            }));
            toast.error(`Failed to send message to ${lead_name}`);
          }
        }else if(templateName === 'video_template'){
          const laraTemplatepayload = {
            to,
            templateName: templateName, 
            languageCode: templateLanguage, 
            videoUrl: selectedImage, 
            // userName: lead_name,
            // websiteLink: 'https://lara.co.in',
          };
    
          try {
            const response = await axios.post(
              `${baseURL}/api/whatsapp/sendVideoTemplate`,
              laraTemplatepayload,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            // console.log("to phone ", to)
            setMessageStatus((prev) => ({
              ...prev,
              [lead.lead_id]: 'success',
            }));
            toast.success(`Message sent to ${lead_name}`);
          } catch (error) {
            console.error('Error sending message:', error);
            setMessageStatus((prev) => ({
              ...prev,
              [lead.lead_id]: 'failure',
            }));
            toast.error(`Failed to send message to ${lead_name}`);
          }
        }else{
          try {
            console.log("to phone ", to)
            const response = await axios.post(
              `${baseURL}/api/whatsapp/sendMediaTemplateWithButton`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
           
            setMessageStatus((prev) => ({
              ...prev,
              [lead.lead_id]: 'success',
            }));
            toast.success(`Message sent to ${name}`);
          } catch (error) {
            console.error('Error sending message:', error);
            setMessageStatus((prev) => ({
              ...prev,
              [lead.lead_id]: 'failure',
            }));
            toast.error(`Failed to send message to ${name}`);
          }
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

  return (
    <div className="container mt-5">
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

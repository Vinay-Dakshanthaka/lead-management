const { Op } = require('sequelize');
const db = require('../models');

const Counsellor = db.Counsellor;
const LeadCounsellor = db.LeadCounsellor;
const Lead = db.Lead;

// const getAllLeadsForCounsellorById = async (req, res) => {
//     try {
//         const  counsellor_id  = req.counsellor_id;
  
//         // Fetch the counsellor details from the Counsellor table
//         const counsellor = await Counsellor.findByPk(counsellor_id, {
//             attributes: ['counsellor_id', 'name', 'email', 'phone'] // Add other relevant counsellor fields if needed
//         });
  
//         // If the counsellor is not found, return an error message
//         if (!counsellor) {
//             return res.status(404).send({ message: "Counsellor not found" });
//         }
  
//         // Fetch all lead assignments from LeadCounsellor where counsellor_id matches
//         const leadCounsellorEntries = await LeadCounsellor.findAll({
//             where: { counsellor_id },
//             include: {
//                 model: db.Lead, // Specify the model to include
//                 as: 'Lead', // Alias defined in the association
//                 attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status'] // Specify relevant Lead fields
//             }
//         });
        
  
//         // If no leads found for the counsellor, return a message
//         if (!leadCounsellorEntries.length) {
//             return res.status(404).send({ message: "No leads found for this counsellor" });
//         }
  
//         // Format the response to include both LeadCounsellor and Lead data
//         const leadsData = leadCounsellorEntries.map(entry => ({
//             lead_id: entry.lead_id,
//             counsellor_id: entry.counsellor_id,
//             assigned_date: entry.assigned_date, // LeadCounsellor fields
//             response: entry.response, // LeadCounsellor fields
//             is_interested: entry.is_interested, // LeadCounsellor fields
//             contacted_date: entry.contacted_date, // LeadCounsellor fields
//             next_contact_date: entry.next_contact_date, // LeadCounsellor fields
//             lead_name: entry.Lead.name,  // From Lead table
//             lead_email: entry.Lead.email, // From Lead table
//             lead_phone: entry.Lead.phone, // From Lead table
//             lead_joining_status: entry.Lead.joining_status // From Lead table
//         }));
  
//         // Return the counsellor details along with the list of leads
//         return res.status(200).send({
//             message: "Leads and counsellor details retrieved successfully",
//             counsellor: {
//                 counsellor_id: counsellor.counsellor_id,
//                 counsellor_name: counsellor.name,
//                 counsellor_email: counsellor.email,
//                 counsellor_phone: counsellor.phone
//             },
//             leads: leadsData
//         });
//     } catch (error) {
//         console.error("Error retrieving leads and counsellor details:", error);
//         return res.status(500).send({ message: "Failed to retrieve leads and counsellor details", error });
//     }
//   };

const getAllLeadsForCounsellorById = async (req, res) => {
    try {
        const counsellor_id = req.counsellor_id;

        // Fetch the counsellor details from the Counsellor table
        const counsellor = await Counsellor.findByPk(counsellor_id, {
            attributes: ['counsellor_id', 'name', 'email', 'phone'] // Add other relevant counsellor fields if needed
        });

        // If the counsellor is not found, return an error message
        if (!counsellor) {
            return res.status(404).send({ message: "Counsellor not found" });
        }

        // Fetch all lead assignments where counsellor_id matches and counsellor is active
        const leadCounsellorEntries = await LeadCounsellor.findAll({
            where: {
                counsellor_id,
                is_active: true // Only fetch leads where the counsellor is active
            },
            include: {
                model: db.Lead, // Specify the model to include
                as: 'Lead', // Alias defined in the association
                attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status'] // Specify relevant Lead fields
            }
        });

        // If no active leads are found for the counsellor, return a message
        if (!leadCounsellorEntries.length) {
            return res.status(404).send({ message: "No active leads found for this counsellor" });
        }

        // Format the response to include both LeadCounsellor and Lead data
        const leadsData = leadCounsellorEntries.map(entry => ({
            lead_id: entry.lead_id,
            counsellor_id: entry.counsellor_id,
            assigned_date: entry.assigned_date, // LeadCounsellor fields
            response: entry.response, // LeadCounsellor fields
            is_interested: entry.is_interested, // LeadCounsellor fields
            contacted_date: entry.contacted_date, // LeadCounsellor fields
            next_contact_date: entry.next_contact_date, // LeadCounsellor fields
            lead_name: entry.Lead.name,  // From Lead table
            lead_email: entry.Lead.email, // From Lead table
            lead_phone: entry.Lead.phone, // From Lead table
            lead_joining_status: entry.Lead.joining_status // From Lead table
        }));

        // Return the counsellor details along with the list of active leads
        return res.status(200).send({
            message: "Active leads and counsellor details retrieved successfully",
            counsellor: {
                counsellor_id: counsellor.counsellor_id,
                counsellor_name: counsellor.name,
                counsellor_email: counsellor.email,
                counsellor_phone: counsellor.phone
            },
            leads: leadsData
        });
    } catch (error) {
        console.error("Error retrieving leads and counsellor details:", error);
        return res.status(500).send({ message: "Failed to retrieve leads and counsellor details", error });
    }
};


  module.exports = {
    getAllLeadsForCounsellorById,
  }
const { Op } = require('sequelize');
const db = require('../models');

const Counsellor = db.Counsellor;
const LeadCounsellor = db.LeadCounsellor;
const Lead = db.Lead;

const getAllCounsellors = async (req, res) => {
    try {
        const userId = req.counsellor_id;
        const user = await Counsellor.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "No user found" });
        }

        const role = user.role;

        // Check if the role is COUNSELLOR
        if (role !== 'ADMIN') {
            return res.status(403).send({ message: "Access denied. Insufficient permissions." });
        }

        // Fetch all counsellors except those with the role 'ADMIN'
        const counsellors = await Counsellor.findAll({
            attributes: {
                exclude: ['password'] // exclude password column
            },
            where: {
                role: {
                    [Op.ne]: 'ADMIN' // exclude role 'ADMIN'
                }
            }
        });

        // Check if there are counsellors in the database
        if (!counsellors.length) {
            return res.status(404).send({ message: "No counsellors found" });
        }

        // Return the list of counsellors
        return res.status(200).send({ message: "Counsellors retrieved successfully", counsellors });
    } catch (error) {
        console.error("Error retrieving counsellors:", error);
        return res.status(500).send({ message: "Failed to retrieve counsellors", error });
    }
};

const getAllLeadsForCounsellor = async (req, res) => {
    try {
        const { counsellor_id } = req.body;

        // Fetch the counsellor details from the Counsellor table
        const counsellor = await Counsellor.findByPk(counsellor_id, {
            attributes: ['counsellor_id', 'name', 'email', 'phone'] // Add other relevant counsellor fields if needed
        });

        // If the counsellor is not found, return an error message
        if (!counsellor) {
            return res.status(404).send({ message: "Counsellor not found" });
        }

        // Fetch all lead assignments from LeadCounsellor where counsellor_id matches
        const leadCounsellorEntries = await LeadCounsellor.findAll({
            where: { counsellor_id },
            include: [
                {
                    model: Lead,
                    as: 'Lead', // Ensure this matches the alias in the associations
                    attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status'] // Specify relevant Lead fields
                },
                {
                    model: Counsellor,
                    as: 'Counsellor', // Ensure this matches the alias in the associations
                    attributes: [] // We don't need to return Counsellor details here, but include it to avoid errors
                }
            ]
        });

        // If no leads found for the counsellor, return a message
        if (!leadCounsellorEntries.length) {
            return res.status(404).send({ message: "No leads found for this counsellor" });
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
            is_active: entry.is_active, // LeadCounsellor fields
            responsible_for_joining: entry.responsible_for_joining, // LeadCounsellor fields
            lead_name: entry.Lead.name,  // From Lead table
            lead_email: entry.Lead.email, // From Lead table
            lead_phone: entry.Lead.phone, // From Lead table
            lead_joining_status: entry.Lead.joining_status // From Lead table
        }));

        // Return the counsellor details along with the list of leads
        return res.status(200).send({
            message: "Leads and counsellor details retrieved successfully",
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


// const getAllLeadsAndCounsellors = async (req, res) => {
//   try {
//       // Fetch all leads along with their associated counsellors and LeadCounsellor data
//       const leads = await Lead.findAll({
//           include: [
//               {
//                   model: Counsellor,
//                   through: { 
//                       attributes: [
//                           'assigned_date', 
//                           'response', 
//                           'is_interested', 
//                           'contacted_date', 
//                           'next_contact_date'
//                       ], // Include specific LeadCounsellor fields
//                   },
//                   as: 'counsellors',
//                   attributes: ['counsellor_id', 'name', 'email', 'phone'] // Add other relevant counsellor fields if needed
//               }
//           ],
//           attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status'] // Specify relevant Lead fields
//       });

//       // Format the response to include both Lead and Counsellor data
//       const leadsData = leads.map(lead => ({
//           lead_id: lead.lead_id,
//           lead_name: lead.name,
//           lead_email: lead.email,
//           lead_phone: lead.phone,
//           lead_joining_status: lead.joining_status,
//           counsellors: lead.counsellors.map(counsellor => ({
//               counsellor_id: counsellor.counsellor_id,
//               counsellor_name: counsellor.name,
//               counsellor_email: counsellor.email,
//               counsellor_phone: counsellor.phone,
//               assigned_date: counsellor.LeadCounsellor.assigned_date,
//               response: counsellor.LeadCounsellor.response,
//               is_interested: counsellor.LeadCounsellor.is_interested,
//               contacted_date: counsellor.LeadCounsellor.contacted_date,
//               next_contact_date: counsellor.LeadCounsellor.next_contact_date,
//               is_active: counsellor.LeadCounsellor.is_active,
//               responsible_for_joining: counsellor.LeadCounsellor.responsible_for_joining,
//           }))
//       }));

//       // Return the leads and associated counsellors
//       return res.status(200).send({
//           message: "Leads and counsellor details retrieved successfully",
//           leads: leadsData
//       });
//   } catch (error) {
//       console.error("Error retrieving leads and counsellor details:", error);
//       return res.status(500).send({ message: "Failed to retrieve leads and counsellor details", error });
//   }
// };

const getAllLeadsAndCounsellors = async (req, res) => {
    try {
        // Fetch all leads along with their associated counsellors and LeadCounsellor data
        const leads = await Lead.findAll({
            include: [
                {
                    model: Counsellor,
                    through: {
                        attributes: [
                            'assigned_date',
                            'response',
                            'is_interested',
                            'contacted_date',
                            'next_contact_date',
                            'is_active',             // Include is_active field
                            'responsible_for_joining' // Include responsible_for_joining field
                        ], // Include specific LeadCounsellor fields
                    },
                    as: 'counsellors',
                    attributes: ['counsellor_id', 'name', 'email', 'phone'] // Add other relevant counsellor fields if needed
                }
            ],
            attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status'] // Specify relevant Lead fields
        });

        // Format the response to include both Lead and Counsellor data
        const leadsData = leads.map(lead => ({
            lead_id: lead.lead_id,
            lead_name: lead.name,
            lead_email: lead.email,
            lead_phone: lead.phone,
            lead_joining_status: lead.joining_status,
            counsellors: lead.counsellors.map(counsellor => ({
                counsellor_id: counsellor.counsellor_id,
                counsellor_name: counsellor.name,
                counsellor_email: counsellor.email,
                counsellor_phone: counsellor.phone,
                assigned_date: counsellor.LeadCounsellor.assigned_date,
                response: counsellor.LeadCounsellor.response,
                is_interested: counsellor.LeadCounsellor.is_interested,
                contacted_date: counsellor.LeadCounsellor.contacted_date,
                next_contact_date: counsellor.LeadCounsellor.next_contact_date,
                is_active: counsellor.LeadCounsellor.is_active,  // Add is_active
                responsible_for_joining: counsellor.LeadCounsellor.responsible_for_joining // Add responsible_for_joining
            }))
        }));

        // Return the leads and associated counsellors
        return res.status(200).send({
            message: "Leads and counsellor details retrieved successfully",
            leads: leadsData
        });
    } catch (error) {
        console.error("Error retrieving leads and counsellor details:", error);
        return res.status(500).send({ message: "Failed to retrieve leads and counsellor details", error });
    }
};


const getDashboardOverview = async (req, res) => {
    try {
        // Total number of leads
        const totalLeads = await Lead.count();

        // Number of leads that have joined
        const totalJoinedLeads = await Lead.count({ where: { joining_status: true } });

        // Number of leads that are interested and active
        const totalInterestedLeads = await LeadCounsellor.count({ 
            where: { 
                is_interested: true,
                is_active: true  // Filter by is_active being true
            } 
        });

        // Counsellor-wise count of joined leads
        const counsellorJoinedLeads = await LeadCounsellor.findAll({
            where: { responsible_for_joining: true },
            include: [
                {
                    model: Counsellor,
                    as: 'Counsellor',
                    attributes: ['counsellor_id', 'name', 'email'],
                },
            ],
            attributes: [
                'counsellor_id',
                [db.sequelize.fn('COUNT', db.sequelize.col('lead_id')), 'joined_leads_count'],
            ],
            group: ['LeadCounsellor.counsellor_id'],
            order: [[db.sequelize.literal('joined_leads_count'), 'DESC']],
        });

        // Counsellor-wise count of interested and active leads
        const counsellorInterestedLeads = await LeadCounsellor.findAll({
            where: { 
                is_interested: true,
                is_active: true  // Filter by is_active being true
            },
            include: [
                {
                    model: Counsellor,
                    as: 'Counsellor',
                    attributes: ['counsellor_id', 'name', 'email'],
                },
            ],
            attributes: [
                'counsellor_id',
                [db.sequelize.fn('COUNT', db.sequelize.col('lead_id')), 'interested_leads_count'],
            ],
            group: ['LeadCounsellor.counsellor_id'],
            order: [[db.sequelize.literal('interested_leads_count'), 'DESC']],
        });

        // Send the aggregated data as response
        res.status(200).json({
            totalLeads,
            totalJoinedLeads,
            totalInterestedLeads,
            counsellorJoinedLeads,
            counsellorInterestedLeads,
        });
    } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};






module.exports = {
    getAllCounsellors,
    getAllLeadsForCounsellor,
    getAllLeadsAndCounsellors,
    getDashboardOverview
}
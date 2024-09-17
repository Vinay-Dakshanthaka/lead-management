const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const { Op } = require('sequelize');

const db = require('../models');

const Lead = db.Lead;
const Counsellor = db.Counsellor;
const LeadCounsellor = db.LeadCounsellor;
// Save new lead data
// const saveLeadData = async (req, res) => {
//     try {
//         const { name, email, phone, response, contacted_date, next_contact_date, joining_status = false } = req.body;

//         // Check if the lead with the same email or phone already exists
//         const existingLead = await Lead.findOne({ where: { email } });
//         if (existingLead) {
//             return res.status(409).send({ message: "Lead with this email already exists" });
//         }

//         // Create a new lead
//         const newLead = await Lead.create({
//             name,
//             email,
//             phone,
//             response,
//             contacted_date,
//             next_contact_date,
//             joining_status: joining_status // Add the joining status with a default value of false
//         });

//         // Send success response with the newly created lead data
//         return res.status(201).send({ message: "Lead saved successfully", lead: newLead });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ message: "Failed to save lead data", error });
//     }
// }

// // Update existing lead data
// const updateLeadData = async (req, res) => {
//     try {
//         const { lead_id } = req.params;
//         const { name, email, phone, response, contacted_date, next_contact_date, joining_status = false } = req.body;

//         // Check if the lead exists
//         const lead = await Lead.findByPk(lead_id);
//         if (!lead) {
//             return res.status(404).send({ message: "Lead not found" });
//         }

//         // Check if the email is being updated and if the new email already exists in another lead
//         if (email !== lead.email) {
//             const existingLead = await Lead.findOne({ where: { email } });
//             if (existingLead) {
//                 return res.status(409).send({ message: "Lead with this email already exists" });
//             }
//         }

//         // Update the lead data
//         await lead.update({
//             name,
//             email,
//             phone,
//             response,
//             contacted_date,
//             next_contact_date,
//             joining_status: joining_status // Update the joining status field
//         });

//         // Send success response with the updated lead data
//         return res.status(200).send({ message: "Lead updated successfully", lead });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ message: "Failed to update lead data", error });
//     }
// };



// Helper function to check if contacted date is today
const isToday = (date) => moment(date).isSame(moment(), 'day');

// Save new lead
const saveLeadData = async (req, res) => {
    try {
        
        const { name, email, phone, counsellor_id } = req.body;

        // Check if the lead with the same phone already exists
        let lead = await Lead.findOne({
            where: { phone }
        });

        // If a lead with the same phone already exists, return an error
        if (lead) {
            return res.status(409).send({ message: "Lead with this phone number already exists" });
        }

        // If lead doesn't exist, create a new lead
        lead = await Lead.create({
            name,
            email,
            phone
        });

        // Check if the counsellor exists
        const counsellor = await Counsellor.findByPk(counsellor_id);
        if (!counsellor) {
            return res.status(404).send({ message: "Counsellor not found" });
        }

        // Check if the lead has an active counsellor and make them inactive
        await LeadCounsellor.update(
            { is_active: false },
            { where: { lead_id: lead.lead_id, is_active: true } }
        );

        // Assign the new counsellor as active
        const assignedDate = moment().format('YYYY-MM-DD HH:mm:ss');  // Store date and time

        await LeadCounsellor.create({
            lead_id: lead.lead_id,
            counsellor_id: counsellor.counsellor_id,
            assigned_date: assignedDate,
            is_active: true  // Set the new counsellor as active
        });

        // Send success response
        return res.status(201).send({ message: "Lead saved and assigned to counsellor successfully", lead });

    } catch (error) {
        console.error("Error saving lead:", error);
        return res.status(500).send({ message: "Failed to save lead data", error });
    }
};

// Update existing lead
// const updateLeadData = async (req, res) => {
//     try {
//         const { lead_id } = req.params;
//         const {
//             name,
//             email,
//             phone,
//             response,
//             contacted_date,
//             next_contact_date,
//             joining_status = false,
//             is_contacted_today // Added field from the form
//         } = req.body;

//         // Check if the lead exists
//         const lead = await Lead.findByPk(lead_id);
//         if (!lead) {
//             return res.status(404).send({ message: "Lead not found" });
//         }

//         // Check if the email or phone is being updated and if the new email or phone already exists in another lead
//         if (email !== lead.email || phone !== lead.phone) {
//             const existingLead = await Lead.findOne({
//                 where: {
//                     [Op.or]: [{ email }, { phone }],
//                     lead_id: { [Op.ne]: lead_id } // Ensure it doesn't match itself
//                 }
//             });
//             if (existingLead) {
//                 return res.status(409).send({ message: "Lead with this email or phone number already exists" });
//             }
//         }

//         // Determine if contacted today
//         let isContactedToday = is_contacted_today || (contacted_date && moment(contacted_date).isSame(moment(), 'day'));

//         // If the next contact date is updated to a future date, reset is_contacted_today to false
//         if (next_contact_date && moment(next_contact_date).isAfter(moment())) {
//             isContactedToday = false;
//         }

//         // Update the lead data
//         await lead.update({
//             name: name || lead.name,
//             email: email || lead.email,
//             phone: phone || lead.phone,
//             response: response || lead.response,
//             contacted_date: contacted_date || lead.contacted_date,
//             next_contact_date: next_contact_date || lead.next_contact_date,
//             joining_status: joining_status !== undefined ? joining_status : lead.joining_status,
//             is_contacted_today: isContactedToday // Update is_contacted_today based on the logic
//         });

//         // Send success response with the updated lead data
//         return res.status(200).send({ message: "Lead updated successfully", lead });

//     } catch (error) {
//         console.error("Error updating lead:", error);
//         return res.status(500).send({ message: "Failed to update lead data", error });
//     }
// };

const reAssignLead = async (req, res) => {
    try {
        const { lead_id, counsellor_id } = req.body;

        if (!lead_id || !counsellor_id) {
            return res.status(400).send({ message: "Lead ID and Counsellor ID are required" });
        }

        // Check if the lead exists
        const lead = await Lead.findByPk(lead_id);
        if (!lead) {
            return res.status(404).send({ message: "Lead not found" });
        }

        // Check if the counsellor exists
        const counsellor = await Counsellor.findByPk(counsellor_id);
        if (!counsellor) {
            return res.status(404).send({ message: "Counsellor not found" });
        }

        // Get the currently active counsellor for the lead
        const activeCounsellor = await LeadCounsellor.findOne({
            where: { lead_id, is_active: true }
        });

        if (activeCounsellor) {
            // Set the current active counsellor to inactive
            await LeadCounsellor.update(
                { is_active: false },
                { where: { lead_id, counsellor_id: activeCounsellor.counsellor_id } }
            );
        }

        // Assign the new counsellor to the lead and set them as active
        const assignedDate = moment().format('YYYY-MM-DD HH:mm:ss');  // Store date and time

        await LeadCounsellor.create({
            lead_id,
            counsellor_id,
            assigned_date: assignedDate,
            is_active: true
        });

        // Send success response
        return res.status(200).send({ message: "Lead successfully reassigned to new counsellor" });

    } catch (error) {
        console.error("Error re-assigning lead:", error);
        return res.status(500).send({ message: "Failed to re-assign lead", error });
    }
};


// const updateLeadDetails = async (req, res) => {
//     try {
//         const counsellor_id = req.counsellor_id;
//         const {
//             lead_id,
//             response,
//             is_interested,
//             contacted_date,
//             next_contact_date,
//             lead_name,
//             lead_email,
//             lead_phone,
//             lead_joining_status
//         } = req.body;

//         // Check if the lead exists
//         let lead = await Lead.findByPk(lead_id);
//         if (!lead) {
//             return res.status(404).send({ message: "Lead not found" });
//         }

//         // Check if the counsellor exists
//         const counsellor = await Counsellor.findByPk(counsellor_id);
//         if (!counsellor) {
//             return res.status(404).send({ message: "Counsellor not found" });
//         }

//         // Check if the lead-counsellor relationship exists in LeadCounsellor
//         const leadCounsellor = await LeadCounsellor.findOne({
//             where: {
//                 lead_id: lead_id,
//                 counsellor_id: counsellor_id
//             }
//         });
//         if (!leadCounsellor) {
//             return res.status(404).send({ message: "LeadCounsellor relationship not found" });
//         }

//         // Update LeadCounsellor details, excluding assigned_date and is_active
//         await LeadCounsellor.update(
//             {
//                 response: response || leadCounsellor.response,
//                 is_interested: is_interested !== undefined ? is_interested : leadCounsellor.is_interested,
//                 contacted_date: contacted_date || leadCounsellor.contacted_date,
//                 next_contact_date: next_contact_date || leadCounsellor.next_contact_date,
//             },
//             {
//                 where: {
//                     lead_id: lead_id,
//                     counsellor_id: counsellor_id
//                 }
//             }
//         );

//         // Update Lead details, excluding lead_id and counsellor_id
//         await Lead.update(
//             {
//                 name: lead_name || lead.name,
//                 email: lead_email || lead.email,
//                 phone: lead_phone || lead.phone,
//                 joining_status: lead_joining_status !== undefined ? lead_joining_status : lead.joining_status
//             },
//             {
//                 where: { lead_id }
//             }
//         );

//         // Fetch the updated lead and lead-counsellor details
//         const updatedLead = await Lead.findByPk(lead_id, {
//             include: [{
//                 model: LeadCounsellor,
//                 where: { counsellor_id },
//                 attributes: ['response', 'is_interested', 'contacted_date', 'next_contact_date']
//             }]
//         });

//         // Send success response with the updated data
//         return res.status(200).send({ message: "Lead details updated successfully", updatedLead });

//     } catch (error) {
//         console.error("Error updating lead details:", error);
//         return res.status(500).send({ message: "Failed to update lead details", error });
//     }
// };

const updateLeadDetails = async (req, res) => {
    try {
        const counsellor_id = req.counsellor_id; // Assume this is extracted from token middleware or request body
        console.log('counsellor id ', counsellor_id)
        const {
            lead_id,
            lead_name,
            lead_email,
            lead_phone,
            lead_joining_status,
            response,
            is_interested,
            contacted_date,
            next_contact_date,
            responsible_for_joining
        } = req.body;

        // Find if the lead exists
        let lead = await Lead.findByPk(lead_id);
        if (!lead) {
            return res.status(404).send({ message: "Lead not found" });
        }

        // Find if the counsellor exists and relationship with the lead
        let leadCounsellor = await LeadCounsellor.findOne({
            where: {
                lead_id,
                counsellor_id
            }
        });
        if (!leadCounsellor) {
            return res.status(404).send({ message: "Counsellor-Lead relationship not found" });
        }

        // Update Lead table details
        await Lead.update(
            {
                name: lead_name || lead.name,
                email: lead_email || lead.email,
                phone: lead_phone || lead.phone,
                joining_status: lead_joining_status !== undefined ? lead_joining_status : lead.joining_status
            },
            {
                where: { lead_id }
            }
        );

        // Update LeadCounsellor table details
        await LeadCounsellor.update(
            {
                response: response || leadCounsellor.response,
                is_interested: is_interested !== undefined ? is_interested : leadCounsellor.is_interested,
                contacted_date: contacted_date || leadCounsellor.contacted_date,
                next_contact_date: next_contact_date || leadCounsellor.next_contact_date,
                responsible_for_joining: responsible_for_joining !== undefined ? responsible_for_joining : leadCounsellor.responsible_for_joining
            },
            {
                where: {
                    lead_id,
                    counsellor_id
                }
            }
        );

        // Fetch the updated lead and lead-counsellor details
        const updatedLead = await Lead.findByPk(lead_id, {
            include: [{
                model: LeadCounsellor,
                where: { counsellor_id },
                attributes: ['response', 'is_interested', 'contacted_date', 'next_contact_date', 'responsible_for_joining']
            }]
        });

        // Return success response with updated data
        return res.status(200).send({ message: "Lead details updated successfully", updatedLead });

    } catch (error) {
        console.error("Error updating lead details:", error);
        return res.status(500).send({ message: "Failed to update lead details", error });
    }
};


// const getLeadDetails = async (req, res) => {
//     try {
//         const counsellor_id = req.counsellor_id; // Get counsellor_id from request
//         const { lead_id } = req.body; // Get lead_id from the request body

//         // Check if the lead exists
//         let lead = await Lead.findByPk(lead_id);
//         if (!lead) {
//             return res.status(404).send({ message: "Lead not found" });
//         }

//         // Check if the counsellor exists
//         const counsellor = await Counsellor.findByPk(counsellor_id);
//         if (!counsellor) {
//             return res.status(404).send({ message: "Counsellor not found" });
//         }

//         // Check if the lead-counsellor relationship exists in LeadCounsellor
//         const leadCounsellor = await LeadCounsellor.findOne({
//             where: {
//                 lead_id: lead_id,
//                 counsellor_id: counsellor_id
//             }
//         });
//         if (!leadCounsellor) {
//             return res.status(404).send({ message: "LeadCounsellor relationship not found" });
//         }

//         // Fetch the lead details along with the LeadCounsellor relationship
//         const leadDetails = await Lead.findByPk(lead_id, {
//             include: [{
//                 model: LeadCounsellor,
//                 where: { counsellor_id },
//                 attributes: ['assigned_date', 'response', 'is_interested', 'contacted_date', 'next_contact_date']
//             }]
//         });

//         // Send success response with the lead details
//         return res.status(200).send({ message: "Lead details fetched successfully", leadDetails });

//     } catch (error) {
//         console.error("Error fetching lead details:", error);
//         return res.status(500).send({ message: "Failed to fetch lead details", error });
//     }
// };


// const uploadLeadData = async (req, res) => {
//     try {
//         const userId = req.counsellor_id;
//         const user = await Counsellor.findByPk(userId);
        
//         if (!user) {
//             return res.status(404).send({ message : "No user found" });
//         }
        
//         const role = user.role;
        
//         // Check if the role is ADMIN
//         if (role !== 'ADMIN') {
//             return res.status(403).send({ message: "Access denied. Insufficient permissions." });
//         }
        
//         // Check if a file was uploaded
//         if (!req.file) {
//             return res.status(400).send({ message: "No file uploaded" });
//         }

//         // Load the uploaded Excel file
//         const filePath = req.file.path;
//         const workbook = xlsx.readFile(filePath);
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         // Convert sheet data to JSON
//         const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

//         const invalidCounsellorIds = [];
//         const invalidRows = [];
//         const leadsToCreate = [];

//         // Email validation regex pattern
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         // Process each row
//         for (const [index, row] of rows.entries()) {
//             const { name, email, phone, counsellor_id } = row;

//             // Skip row if phone is missing
//             if (!phone) {
//                 continue;
//             }

//             let validEmail = true;
//             let validPhone = true;

//             // Validate the email format
//             if (email && !emailPattern.test(email)) {
//                 validEmail = false;
//                 invalidRows.push({ rowNumber: index + 2, reason: "Invalid email format" });
//             }

//             // Validate phone number format (assuming it's a 10-digit number)
//             if (!/^\d{10}$/.test(phone)) {
//                 validPhone = false;
//                 invalidRows.push({ rowNumber: index + 2, reason: "Invalid phone format" });
//             }

//             // Skip row if phone is not valid
//             if (!validPhone) {
//                 continue;
//             }

//             // Prepare lead data
//             const leadData = {
//                 name: name || null,            // Save name if available, else null
//                 email: validEmail ? email : null,  // Only set email if it's valid
//                 phone: phone,                  // Phone is required
//                 counsellor_id: null            // Default to null
//             };

//             try {
//                 // Save lead
//                 const lead = await Lead.create(leadData);

//                 // Validate counsellor_id and prepare to associate if valid
//                 if (counsellor_id) {
//                     const counsellor = await Counsellor.findOne({ where: { counsellor_id } });
//                     if (counsellor) {
//                         // Save relationship to LeadCounsellor table
//                         await LeadCounsellor.create({
//                             lead_id: lead.lead_id,
//                             counsellor_id: counsellor.counsellor_id
//                         });
//                     } else {
//                         invalidCounsellorIds.push(counsellor_id);
//                     }
//                 }
//             } catch (error) {
//                 if (error.name === 'SequelizeUniqueConstraintError') {
//                     // Duplicate entry error, skip this row
//                     invalidRows.push({ rowNumber: index + 2, reason: "Duplicate phone number" });
//                 } else {
//                     // Re-throw unexpected errors
//                     throw error;
//                 }
//             }
//         }

//         // Clean up: delete the uploaded file
//         fs.unlinkSync(filePath);

//         // Prepare response message
//         let responseMessage = "Leads uploaded successfully";
//         if (invalidCounsellorIds.length > 0) {
//             responseMessage += `. The following counsellor_ids are invalid or do not exist: ${invalidCounsellorIds.join(', ')}`;
//         }

//         if (invalidRows.length > 0) {
//             responseMessage += `. Some rows were skipped due to errors: ${invalidRows.map(r => `Row ${r.rowNumber}: ${r.reason}`).join('; ')}`;
//         }

//         // Send response
//         return res.status(201).send({ message: responseMessage });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ message: "Failed to upload lead data", error });
//     }
// };

const getLeadDetails = async (req, res) => {
    try {
        const counsellor_id = req.counsellor_id; // Get counsellor_id from request
        const { lead_id } = req.body; // Get lead_id from the request body

        // Check if the lead exists
        let lead = await Lead.findByPk(lead_id);
        if (!lead) {
            return res.status(404).send({ message: "Lead not found" });
        }

        // Check if the counsellor exists
        const counsellor = await Counsellor.findByPk(counsellor_id);
        if (!counsellor) {
            return res.status(404).send({ message: "Counsellor not found" });
        }

        // Check if the lead-counsellor relationship exists in LeadCounsellor
        const leadCounsellor = await LeadCounsellor.findOne({
            where: {
                lead_id: lead_id,
                counsellor_id: counsellor_id
            }
        });
        if (!leadCounsellor) {
            return res.status(404).send({ message: "LeadCounsellor relationship not found" });
        }

        // Fetch the lead details along with the LeadCounsellor relationship
        const leadDetails = await Lead.findByPk(lead_id, {
            include: [{
                model: LeadCounsellor,
                where: { counsellor_id },
                attributes: [
                    'assigned_date',
                    'response',
                    'is_interested',
                    'contacted_date',
                    'next_contact_date',
                    'responsible_for_joining'
                ]
            }]
        });

        // Send success response with the lead details
        return res.status(200).send({
            message: "Lead details fetched successfully",
            leadDetails: {
                ...leadDetails.toJSON(), // Convert to JSON to handle associations properly
                leadCounsellor: leadDetails.LeadCounsellors[0] // Assume one-to-one relationship
            }
        });

    } catch (error) {
        console.error("Error fetching lead details:", error);
        return res.status(500).send({ message: "Failed to fetch lead details", error });
    }
};


const uploadLeadData = async (req, res) => {
    try {
        const userId = req.counsellor_id;
        const user = await Counsellor.findByPk(userId);
        
        if (!user) {
            return res.status(404).send({ message : "No user found" });
        }
        
        const role = user.role;
        
        // Check if the role is ADMIN
        if (role !== 'ADMIN') {
            return res.status(403).send({ message: "Access denied. Insufficient permissions." });
        }
        
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        // Load the uploaded Excel file
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

        const invalidCounsellorIds = [];
        const invalidRows = [];
        const leadsToCreate = [];

        // Email validation regex pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Process each row
        for (const [index, row] of rows.entries()) {
            const { name, email, phone, counsellor_id } = row;

            // Skip row if phone is missing
            if (!phone) {
                continue;
            }

            let validEmail = true;
            let validPhone = true;

            // Validate the email format
            if (email && !emailPattern.test(email)) {
                validEmail = false;
                invalidRows.push({ rowNumber: index + 2, reason: "Invalid email format" });
            }

            // Validate phone number format (assuming it's a 10-digit number)
            if (!/^\d{10}$/.test(phone)) {
                validPhone = false;
                invalidRows.push({ rowNumber: index + 2, reason: "Invalid phone format" });
            }

            // Skip row if phone is not valid
            if (!validPhone) {
                continue;
            }

            // Prepare lead data
            const leadData = {
                name: name || null,            // Save name if available, else null
                email: validEmail ? email : null,  // Only set email if it's valid
                phone: phone,                  // Phone is required
                counsellor_id: null            // Default to null
            };

            try {
                // Save lead
                const lead = await Lead.create(leadData);

                // Check if the counsellor_id is valid
                if (counsellor_id) {
                    const counsellor = await Counsellor.findOne({ where: { counsellor_id } });
                    if (counsellor) {
                        // Deactivate any currently active counsellor for this lead
                        await LeadCounsellor.update(
                            { is_active: false },
                            { where: { lead_id: lead.lead_id, is_active: true } }
                        );

                        // Save relationship to LeadCounsellor table
                        await LeadCounsellor.create({
                            lead_id: lead.lead_id,
                            counsellor_id: counsellor.counsellor_id,
                            assigned_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                            is_active: true  // Set the new counsellor as active
                        });
                    } else {
                        invalidCounsellorIds.push(counsellor_id);
                    }
                }
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    // Duplicate entry error, skip this row
                    invalidRows.push({ rowNumber: index + 2, reason: "Duplicate phone number" });
                } else {
                    // Re-throw unexpected errors
                    throw error;
                }
            }
        }

        // Clean up: delete the uploaded file
        fs.unlinkSync(filePath);

        // Prepare response message
        let responseMessage = "Leads uploaded successfully";
        if (invalidCounsellorIds.length > 0) {
            responseMessage += `. The following counsellor_ids are invalid or do not exist: ${invalidCounsellorIds.join(', ')}`;
        }

        if (invalidRows.length > 0) {
            responseMessage += `. Some rows were skipped due to errors: ${invalidRows.map(r => `Row ${r.rowNumber}: ${r.reason}`).join('; ')}`;
        }

        // Send response
        return res.status(201).send({ message: responseMessage });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Failed to upload lead data", error });
    }
};


const getLeadData = async (req, res) => {
    try {
        const userId = req.counsellor_id;
        const user = await Counsellor.findByPk(userId);
        
        if (!user) {
            return res.status(404).send({ message: "No user found" });
        }
        
        const role = user.role;
        
        // Check if the role is ADMIN
        if (role !== 'ADMIN') {
            return res.status(403).send({ message: "Access denied. Insufficient permissions." });
        }
        
        // Fetch all leads from the database where joining_status is false
        const leads = await Lead.findAll({
            where: {
                joining_status: false
            },
            include: [
                {
                    model: LeadCounsellor,
                    as: 'LeadCounsellors', // Alias for the relationship
                    include: {
                        model: Counsellor,
                        as: 'Counsellor', // Alias for the relationship
                        attributes: ['counsellor_id', 'name', 'email']
                    },
                    where: { is_active: true },
                    required: false // This ensures leads without an active counsellor are still included
                }
            ],
            attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status'] // Specify relevant Lead fields
        });

        // Format the response to include both Lead and active Counsellor data
        const leadDataWithActiveCounsellor = leads.map(lead => ({
            lead_id: lead.lead_id,
            lead_name: lead.name,
            lead_email: lead.email,
            lead_phone: lead.phone,
            lead_joining_status: lead.joining_status,
            activeCounsellor: lead.LeadCounsellors.length > 0 ? lead.LeadCounsellors[0].Counsellor : null
        }));

        // If no leads found, send an appropriate response
        if (leadDataWithActiveCounsellor.length === 0) {
            return res.status(404).send({ message: "No leads found" });
        }

        // Send success response with the retrieved lead data and active counsellor information
        return res.status(200).send({
            message: "Leads and active counsellor details retrieved successfully",
            leads: leadDataWithActiveCounsellor
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to retrieve lead data", error });
    }
};



const getLeadDataById = async (req, res) => {
    try {


        const { lead_id } = req.params;
        

        // Find the lead by lead_id
        const lead = await Lead.findByPk(lead_id);

        if (!lead) {
            return res.status(404).send({ message: "Lead not found" });
        }

        // Send success response with the lead data
        return res.status(200).send({ message: "Lead found successfully", lead });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to fetch lead data", error });
    }
}

const getJoinedLeadData = async (req, res) => {
    try {
        // Fetch all leads where joined_course is true
        const leads = await Lead.findAll({
            where: {
                joining_status: true
            }
        });

        // If no joined leads found, send an appropriate response
        if (!leads || leads.length === 0) {
            return res.status(404).send({ message: "No joined leads found" });
        }

        // Send success response with the retrieved lead data
        return res.status(200).send({ message: "Joined leads retrieved successfully", leads });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to retrieve joined lead data", error });
    }
};



module.exports = {
    saveLeadData,
    reAssignLead,
    // updateLeadData,
    updateLeadDetails,
    uploadLeadData,
    getLeadData,
    getLeadDataById,
    getJoinedLeadData,
    getLeadDetails,
}
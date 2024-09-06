const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const { Op } = require('sequelize');

const db = require('../models');

const Lead = db.Lead;

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
        const { name, email, phone, response, contacted_date, next_contact_date, joining_status = false } = req.body;

        // Check if the lead with the same email or phone already exists
        const existingLead = await Lead.findOne({
            where: {
                [Op.or]: [{ email }, { phone }]
            }
        });
        if (existingLead) {
            return res.status(409).send({ message: "Lead with this email or phone number already exists" });
        }

        // Determine if contacted today
        const isContactedToday = contacted_date && isToday(contacted_date);

        // Create a new lead
        const newLead = await Lead.create({
            name,
            email,
            phone,
            response,
            contacted_date,
            next_contact_date,
            joining_status,
            is_contacted_today: isContactedToday
        });

        // Send success response with the newly created lead data
        return res.status(201).send({ message: "Lead saved successfully", lead: newLead });

    } catch (error) {
        console.error("Error saving lead:", error);
        return res.status(500).send({ message: "Failed to save lead data", error });
    }
};

// Update existing lead
const updateLeadData = async (req, res) => {
    try {
        const { lead_id } = req.params;
        const {
            name,
            email,
            phone,
            response,
            contacted_date,
            next_contact_date,
            joining_status = false,
            is_contacted_today // Added field from the form
        } = req.body;

        // Check if the lead exists
        const lead = await Lead.findByPk(lead_id);
        if (!lead) {
            return res.status(404).send({ message: "Lead not found" });
        }

        // Check if the email or phone is being updated and if the new email or phone already exists in another lead
        if (email !== lead.email || phone !== lead.phone) {
            const existingLead = await Lead.findOne({
                where: {
                    [Op.or]: [{ email }, { phone }],
                    lead_id: { [Op.ne]: lead_id } // Ensure it doesn't match itself
                }
            });
            if (existingLead) {
                return res.status(409).send({ message: "Lead with this email or phone number already exists" });
            }
        }

        // Determine if contacted today
        let isContactedToday = is_contacted_today || (contacted_date && moment(contacted_date).isSame(moment(), 'day'));

        // If the next contact date is updated to a future date, reset is_contacted_today to false
        if (next_contact_date && moment(next_contact_date).isAfter(moment())) {
            isContactedToday = false;
        }

        // Update the lead data
        await lead.update({
            name: name || lead.name,
            email: email || lead.email,
            phone: phone || lead.phone,
            response: response || lead.response,
            contacted_date: contacted_date || lead.contacted_date,
            next_contact_date: next_contact_date || lead.next_contact_date,
            joining_status: joining_status !== undefined ? joining_status : lead.joining_status,
            is_contacted_today: isContactedToday // Update is_contacted_today based on the logic
        });

        // Send success response with the updated lead data
        return res.status(200).send({ message: "Lead updated successfully", lead });

    } catch (error) {
        console.error("Error updating lead:", error);
        return res.status(500).send({ message: "Failed to update lead data", error });
    }
};




const uploadLeadData = async (req, res) => {
    try {
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

        // Process each row
        for (const row of rows) {
            const { name, email, phone, response, contacted_date, next_contact_date } = row;

            // Skip the row if all fields are empty
            if (!name && !email && !phone && !response && !contacted_date && !next_contact_date) {
                continue;
            }

            // If the email exists, skip this row
            if (email) {
                const existingLead = await Lead.findOne({ where: { email } });
                if (existingLead) {
                    continue;
                }
            }

            // Store the lead, prioritizing the phone number if only it is available
            await Lead.create({
                name: name || null,
                email: email || null,
                phone: phone || null,
                response: response || null,
                contacted_date: contacted_date ? new Date(contacted_date) : null,
                next_contact_date: next_contact_date ? new Date(next_contact_date) : null
            });
        }

        // Clean up: delete the uploaded file
        fs.unlinkSync(filePath);

        // Send success response
        return res.status(201).send({ message: "Leads uploaded successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to upload lead data", error });
    }
};

const getLeadData = async (req, res) => {
    try {
        // Fetch all leads from the database
        const leads = await Lead.findAll({
            where: {
                joining_status: false
            }
        });

        // If no leads found, send an appropriate response
        if (!leads || leads.length === 0) {
            return res.status(404).send({ message: "No leads found" });
        }

        // Send success response with the retrieved lead data
        return res.status(200).send({ message: "Leads retrieved successfully", leads });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to retrieve lead data", error });
    }
}

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
    updateLeadData,
    uploadLeadData,
    getLeadData,
    getLeadDataById,
    getJoinedLeadData,
}
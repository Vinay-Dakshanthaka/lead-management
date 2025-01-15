const axios = require('axios');
require('dotenv').config();
const db = require('../models');

const WhatsAppLead = db.WhatsAppLead;
const Counsellor = db.Counsellor;
const MessageStatus = db.MessageStatus; 

const saveWhatsAppLeadData = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            place,
            district,
            state,
            pin,
            college,
            university,
            qualification,
            year_of_passout
        } = req.body;

        // Check if the WhatsApp lead with the same phone already exists
        let lead = await WhatsAppLead.findOne({
            where: { phone }
        });

        // If a lead with the same phone already exists, return an error
        if (lead) {
            return res.status(409).send({ message: "WhatsApp lead with this phone number already exists" });
        }

        // If lead doesn't exist, create a new lead
        lead = await WhatsAppLead.create({
            name,
            email,
            phone,
            place,
            district,
            state,
            pin,
            college,
            university,
            qualification,
            year_of_passout
        });

        // Send success response
        return res.status(201).send({
            message: "WhatsApp lead saved successfully",
            lead
        });

    } catch (error) {
        console.error("Error saving WhatsApp lead:", error);
        return res.status(500).send({ message: "Failed to save WhatsApp lead data", error });
    }
};

const getAllWhatsAppLeads = async (req, res) => {
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

        // Fetch all WhatsApp leads in descending order
        const leads = await WhatsAppLead.findAll({
            order: [["lead_id", "DESC"]], 
        });

        // Check if leads exist
        if (leads.length === 0) {
            return res.status(404).send({ message: "No WhatsApp leads found" });
        }

        // Send success response with the list of leads
        return res.status(200).send({
            message: "WhatsApp leads retrieved successfully",
            leads
        });

    } catch (error) {
        console.error("Error fetching WhatsApp leads:", error);
        return res.status(500).send({ message: "Failed to fetch WhatsApp lead data", error });
    }
};

const getAllMessageStatuses = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = "", recipient_id = "" } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 25);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({
                message: "Invalid page or limit value. Both should be positive integers.",
            });
        }

        const offset = (pageNumber - 1) * limitNumber;

        // Dynamic filter conditions
        const conditions = {};
        if (status) conditions.status = status;
        if (recipient_id) conditions.recipient_id = recipient_id;

        const { rows: messageStatuses, count: totalRecords } = await MessageStatus.findAndCountAll({
            where: conditions,
            order: [["timestamp", "DESC"]],
            limit: limitNumber,
            offset,
            attributes: ["id", "recipient_id", "message_id", "status", "timestamp", "error_code", "error_title", "error_message", "error_details"],
        });

        const totalPages = Math.ceil(totalRecords / limitNumber);

        return res.status(200).json({
            message: "Message statuses retrieved successfully.",
            data: messageStatuses,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        });
    } catch (error) {
        console.error("Error fetching message statuses:", error);
        return res.status(500).json({
            message: "Failed to fetch message status data.",
            error: error.message,
        });
    }
};



module.exports = {
    saveWhatsAppLeadData,
    getAllWhatsAppLeads,
    getAllMessageStatuses
}
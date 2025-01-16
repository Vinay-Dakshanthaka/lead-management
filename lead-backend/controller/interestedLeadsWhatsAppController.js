const axios = require('axios');
require('dotenv').config();
const db = require('../models');

const InterestedLeadsWhatsApp = db.InterestedLeadsWhatsApp;

const saveInterestedLeadData = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            college,
            place
        } = req.body;

        // Check if an interested lead with the same phone already exists
        let lead = await InterestedLeadsWhatsApp.findOne({
            where: { phone }
        });

        // If a lead with the same phone already exists, return an error
        if (lead) {
            return res.status(409).send({ message: "Lead with this phone number already exists" });
        }

        // If lead doesn't exist, create a new lead
        lead = await InterestedLeadsWhatsApp.create({
            name,
            email,
            phone,
            college,
            place
        });

        // Send success response
        return res.status(201).send({
            message: "Lead saved successfully",
            lead
        });

    } catch (error) {
        console.error("Error saving interested lead:", error);
        return res.status(500).send({ message: "Failed to save interested lead data", error });
    }
};

module.exports = { saveInterestedLeadData };

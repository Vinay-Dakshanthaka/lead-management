const express = require('express');
// const { User, WebhookMessage, WebhookMessageStatus } = require('../models'); 
// const { downloadMedia } = require('../utils/downloadMedia'); // Media download helper
const webhookrouter = express.Router();

// Facebook webhook verification
const token = process.env.WHATSAPP_TOKEN;
const mytoken = process.env.CHECK_TOKEN;

webhookrouter.get('/webhook', (req, res) => {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    if (mode && token) {
        if (mode === "subscribe" && token === mytoken) {
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }
});

// Handle incoming webhook events
webhookrouter.post('/webhook', async (req, res) => {
    try {
        const bodyParam = req.body;
        console.log("Webhook payload received:", JSON.stringify(bodyParam, null, 2));

        if (bodyParam.object === 'whatsapp_business_account') {
            const entries = bodyParam.entry || [];

            for (const entry of entries) {
                const changes = entry.changes || [];

                for (const change of changes) {
                    const value = change.value || {};

                    // Process incoming messages
                    if (value.messages && value.messages.length > 0) {
                        await handleIncomingMessages(value);
                    }

                    // Process message statuses
                    if (value.statuses && value.statuses.length > 0) {
                        await handleMessageStatuses(value);
                    }
                }
            }

            // Respond to the webhook
            return res.sendStatus(200);
        } else {
            console.error("Invalid webhook event received.");
            return res.sendStatus(404);
        }
    } catch (error) {
        console.error("Error processing webhook event:", error);
        return res.sendStatus(500);
    }
});

module.exports = webhookrouter;

const express = require('express');
// const { User, WebhookMessage, WebhookMessageStatus } = require('../models'); 
// const { downloadMedia } = require('../utils/downloadMedia'); // Media download helper
const webhookrouter = express.Router();

// Facebook webhook verification
webhookrouter.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_TOKEN; // Set this token in your environment variables

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log("Webhook verification successful.");
        return res.status(200).send(challenge);
    } else {
        console.error("Webhook verification failed.");
        return res.sendStatus(403);
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

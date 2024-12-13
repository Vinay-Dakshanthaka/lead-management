const express = require('express');
// const { User, WebhookMessage, WebhookMessageStatus } = require('../models'); 
const { downloadMedia } = require('../utils/downloadMedia'); // Media download helper
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

// Helper function to handle incoming messages
// const handleIncomingMessages = async (value) => {
//     const phoneNumberId = value.metadata.phone_number_id;

//     for (const message of value.messages) {
//         const from = message.from; // Sender's WhatsApp ID
//         const userPhone = from.replace(/^91/, ''); // Adjust if needed for other country codes
//         const timestamp = new Date(message.timestamp * 1000);

//         try {
//             // Check and update the user in the database
//             const user = await User.findOne({ where: { phone: userPhone } });
//             if (user) {
//                 await User.update({ last_interaction_time: timestamp }, { where: { phone: userPhone } });
//                 console.log(`Updated last_interaction_time for user: ${userPhone}`);
//             } else {
//                 console.log(`User not found for phone: ${userPhone}`);
//             }

//             // Save message data
//             const messageData = {
//                 whatsappUserId: from,
//                 whatsappUserName: message.profile?.name || null,
//                 phoneNumberId: phoneNumberId,
//                 messageId: message.id,
//                 messageBody: message.text?.body || null,
//                 timestamp: timestamp,
//                 direction: 'incoming'
//             };

//             // Handle media and location messages
//             if (['image', 'video', 'audio', 'document'].includes(message.type)) {
//                 const mediaId = message[message.type].id;
//                 const mimeType = message[message.type].mime_type;
//                 const caption = message.caption || null;
//                 const mediaPath = await downloadMedia(mediaId, mimeType, process.env.CLIENT_NAME);

//                 Object.assign(messageData, {
//                     mediaId,
//                     mediaType: message.type,
//                     mimeType,
//                     caption,
//                     mediaPathUrl: mediaPath
//                 });
//             }

//             if (message.location) {
//                 Object.assign(messageData, {
//                     locationLatitude: message.location.latitude,
//                     locationLongitude: message.location.longitude,
//                     locationName: message.location.name,
//                     locationAddress: message.location.address
//                 });
//             }

//             await WebhookMessage.create(messageData);
//             console.log("Message saved to WebhookMessage table.");
//         } catch (error) {
//             console.error("Error handling incoming message:", error);
//         }
//     }
// };

// // Helper function to handle message statuses
// const handleMessageStatuses = async (value) => {
//     for (const status of value.statuses) {
//         const statusTimestamp = new Date(status.timestamp * 1000);
//         const recipientId = status.recipient_id;

//         const statusData = {
//             messageId: status.id,
//             recipientId,
//             status: status.status,
//             timestamp: statusTimestamp,
//             conversationId: status.conversation?.id || null,
//             conversationCategory: status.conversation?.origin?.type || null,
//             isBillable: status.pricing?.billable || false,
//             errorCode: status.errors?.[0]?.code || null,
//             errorTitle: status.errors?.[0]?.title || null,
//             errorMessage: status.errors?.[0]?.message || null,
//             errorDetails: status.errors?.[0]?.error_data?.details || null,
//             direction: 'outgoing'
//         };

//         try {
//             const message = await WebhookMessage.findOne({
//                 where: { whatsappUserId: recipientId, messageId: status.id }
//             });

//             if (message) {
//                 await WebhookMessageStatus.create(statusData);
//                 console.log("Status saved to WebhookMessageStatus table.");
//             } else {
//                 console.warn("No matching message found for status:", status);
//             }
//         } catch (error) {
//             console.error("Error handling message status:", error);
//         }
//     }
// };

module.exports = router;

const express = require('express');
// const { User, WebhookMessage, WebhookMessageStatus } = require('../models'); 
// const { downloadMedia } = require('../utils/downloadMedia'); // Media download helper
const webhookrouter = express.Router();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const db = require('../models')
const MessageStatus = db.MessageStatus; 

// Facebook webhook verification
const token = process.env.WHATSAPP_TOKEN;
const mytoken = process.env.CHECK_TOKEN;

const db = require('../models');
const MessageStatus = db.MessageStatus;


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
// webhookrouter.post('/webhook', async (req, res) => {
//     try {
//         const bodyParam = req.body;
//         console.log("Webhook payload received:", JSON.stringify(bodyParam, null, 2));

//         if (bodyParam.object === 'whatsapp_business_account') {
//             const entries = bodyParam.entry || [];

//             for (const entry of entries) {
//                 const changes = entry.changes || [];

//                 for (const change of changes) {
//                     const value = change.value || {};

//                     // Process incoming messages
//                     if (value.messages && value.messages.length > 0) {
//                         await handleIncomingMessages(value);
//                     }

//                     // Process message statuses
//                     if (value.statuses && value.statuses.length > 0) {
//                         await handleMessageStatuses(value);
//                     }
//                 }
//             }

//             // Respond to the webhook
//             return res.sendStatus(200);
//         } else {
//             console.error("Invalid webhook event received.");
//             return res.sendStatus(404);
//         }
//     } catch (error) {
//         console.error("Error processing webhook event:", error);
//         return res.sendStatus(500);
//     }
// });

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

                  // Process message statuses
                  if (value.statuses && value.statuses.length > 0) {
                      for (const status of value.statuses) {
                          const messageStatusData = {
                              recipient_id: status.recipient_id,
                              message_id: status.id,
                              status: status.status,
                              timestamp: status.timestamp,
                              error_code: status.errors?.[0]?.code || null,
                              error_title: status.errors?.[0]?.title || null,
                              error_message: status.errors?.[0]?.message || null,
                              error_details: status.errors?.[0]?.error_data?.details || null,
                          };

                          // Save to the database
                          await MessageStatus.create(messageStatusData);
                      }
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


const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0"; 
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID; // Your WhatsApp Business phone number ID
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const APP_ID=process.env.APP_ID


// webhookrouter.post("/create-template", async (req, res) => {
//     try {
//       const { imageUrl } = req.body; // Image URL to upload
  
//       // Step 1: Upload the image and get the media ID
//       const uploadResponse = await axios.post(
//         `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/media`,
//         {
//           messaging_product: "whatsapp",
//           type: "image",
//           url: imageUrl,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${ACCESS_TOKEN}`,
//           },
//         }
//       );
  
//       const mediaId = uploadResponse.data.id;
  
//       console.log("Media uploaded successfully. Media ID:", mediaId);
  
//       // Step 2: Use the media ID to create a template
//       const templateData = {
//         name: "image_template_example",
//         category: "MARKETING",
//         language: "en",
//         components: [
//           {
//             type: "HEADER",
//             format: "IMAGE",
//             example: { header_handle: [mediaId] }, // Use the uploaded media ID
//           },
//           {
//             type: "BODY",
//             text: "Hello {{1}}, Welcome to Lara Technologies! We are a premier Java Full-Stack Training Institute located in Bengaluru. Visit our website at https://lara.co.in for more information. Let us know if you are interested in starting your journey with us!!",
//           },
//           {
//             type: "FOOTER",
//             text: "Lara Technologies",
//           },
//         ],
//       };
  
//       const templateResponse = await axios.post(
//         `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/message_templates`,
//         templateData,
//         {
//           headers: {
//             Authorization: `Bearer ${ACCESS_TOKEN}`,
//           },
//         }
//       );
  
//       res.json({
//         templateId: templateResponse.data.id,
//         mediaId,
//         message: "Template created successfully with the uploaded image.",
//       });
//     } catch (error) {
//         console.log("Erroro while uploading image ::", error)
//       console.error("Error:", error.response?.data || error.message);
//       res.status(500).json({
//         error: error.response?.data || "Failed to upload media or create template",
//       });
//     }
//   });

webhookrouter.post("/create-template", async (req, res) => {
    try {
      const { imageUrl } = req.body; // Image URL to upload
  
      // Step 1: Download the image locally
      const imagePath = path.resolve(__dirname, "temp_image.jpg"); // Temporary file storage
      const writer = fs.createWriteStream(imagePath);
  
      const downloadResponse = await axios({
        method: "get",
        url: imageUrl,
        responseType: "stream",
      });
  
      downloadResponse.data.pipe(writer);
  
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
  
      console.log("Image downloaded successfully.");
  
      // Step 2: Start an upload session
      const fileStats = fs.statSync(imagePath);
      const fileLength = fileStats.size;
      const fileName = path.basename(imagePath);
      const fileType = "image/jpeg";
  
      const startUploadResponse = await axios.post(
        `${WHATSAPP_API_URL}/${APP_ID}/uploads`,
        null,
        {
          params: {
            file_name: fileName,
            file_length: fileLength,
            file_type: fileType,
          },
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
  
      const uploadSessionId = startUploadResponse.data.id.split(":")[1];
      console.log("Upload session started:", uploadSessionId);
  
      // Step 3: Upload the file
      const fileStream = fs.createReadStream(imagePath);
      const uploadResponse = await axios.post(
        `${WHATSAPP_API_URL}/upload:${uploadSessionId}`,
        fileStream,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "file_offset": 0,
            "Content-Type": "application/octet-stream",
          },
        }
      );
  
      const mediaHandle = uploadResponse.data.h;
      console.log("File uploaded successfully. Media handle:", mediaHandle);
  
      // Step 4: Use the media handle to create a template
      const templateData = {
        name: "image_template_example",
        category: "MARKETING",
        language: "en",
        components: [
          {
            type: "HEADER",
            format: "IMAGE",
            example: { header_handle: [mediaHandle] }, // Use the uploaded media handle
          },
          {
            type: "BODY",
            text: "Hello {{1}}, Welcome to Lara Technologies! We are a premier Java Full-Stack Training Institute located in Bengaluru. Visit our website at https://lara.co.in for more information. Let us know if you are interested in starting your journey with us!!",
          },
          {
            type: "FOOTER",
            text: "Lara Technologies",
          },
        ],
      };
  
      const templateResponse = await axios.post(
        `${WHATSAPP_API_URL}/${APP_ID}/message_templates`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
  
      // Cleanup: Remove the downloaded image
      fs.unlinkSync(imagePath);
  
      res.json({
        templateId: templateResponse.data.id,
        mediaHandle,
        message: "Template created successfully with the uploaded image.",
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      res.status(500).json({
        error: error.response?.data || "Failed to upload media or create template",
      });
    }
  });

  webhookrouter.post("/send-template", async (req, res) => {
    try {
      const { recipient, mediaId } = req.body;
  
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: recipient,
          type: "template",
          template: {
            name: "image_template_example",
            language: { code: "en" },
            components: [
              {
                type: "HEADER",
                parameters: [
                  {
                    type: "image",
                    image: { id: mediaId }, // Media ID
                  },
                ],
              },
              {
                type: "BODY",
                parameters: [
                  {
                    type: "text",
                    text: "Vinay", // Replace {{1}} in template
                  },
                ],
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
  
      res.json({
        messageId: response.data.messages[0].id,
        message: "Template sent successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.response?.data || "Failed to send template message",
      });
    }
  });
  
  
  

module.exports = webhookrouter;

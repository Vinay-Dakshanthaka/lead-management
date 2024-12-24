const express = require('express');
const whatsAppRoutes = express.Router();
const axios = require('axios');
const whatsAppController = require('../controller/whatsAppController');
const FormData = require("form-data");
const multer = require('multer');
const path = require('path');
const authenticateToken  = require('../middlewares/authenticateToken')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Directory for uploads
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
    },
  });

// Initialize Multer
const upload = multer();


// whatsAppRoutes.post('/create-template', whatsAppController.createWhatsAppTemplate);
whatsAppRoutes.post('/create-template',  whatsAppController.createWhatsAppTemplate);
whatsAppRoutes.post('/upload-media', upload.single('image'), whatsAppController.uploadMediaToWhatsApp);
whatsAppRoutes.post('/registerPhoneNumber',  whatsAppController.registerPhoneNumber);
whatsAppRoutes.post('/sendMediaTemplateMessage',  whatsAppController.sendMediaTemplateMessage);
whatsAppRoutes.post('/sendMediaTemplateWithButton',  whatsAppController.sendMediaTemplateWithButton);
whatsAppRoutes.post('/sendLaraJan2025BatchTemplate',  whatsAppController.sendLaraJan2025BatchTemplate);
whatsAppRoutes.post('/uploadTemplateImage', upload.single('image'), authenticateToken, whatsAppController.uploadTemplateImage);
whatsAppRoutes.get('/getAllTemplateImages',  whatsAppController.getAllTemplateImages);
whatsAppRoutes.get('/getTemplateImageById/:id',  whatsAppController.getTemplateImageById);
whatsAppRoutes.get('/getTemplateImagesByCounsellorId', authenticateToken, whatsAppController.getTemplateImagesByCounsellorId);


whatsAppRoutes.post("/uploadMediaToWhatsApp", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname); // Add the file
    formData.append("type", file.mimetype); // Specify MIME type
    formData.append("messaging_product", "whatsapp"); // Add messaging_product parameter

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/media`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          ...formData.getHeaders(),
        },
      }
    );

    res.status(200).json({ mediaId: response.data.id });
  } catch (error) {
    console.error("Error uploading media:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to upload media" });
  }
});

whatsAppRoutes.post("/createWhatsAppTemplate", async (req, res) => {
  try {
    const { templateName, language, bodyText, mediaId } = req.body;

    if (!templateName || !language || !bodyText || !mediaId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const payload = {
      messaging_product: "whatsapp",
      to: req.body.to, // Receiver's phone number
      type: "template",
      template: {
        name: templateName,
        language: { code: language },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  id: mediaId,
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: bodyText,
              },
            ],
          },
        ],
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v16.0/${process.env.PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ messageId: response.data.messages[0].id });
  } catch (error) {
    console.error("Error sending template:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send WhatsApp template" });
  }
});


whatsAppRoutes.get("/listWhatsAppTemplates", async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v21.0/${process.env.BUSINESS_ID}/message_templates`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        },
      }
    );
    console.log("Template List :",response.data)

    res.status(200).json({ templates: response.data });
  } catch (error) {
    console.error("Error fetching templates:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch WhatsApp templates" });
  }
});

whatsAppRoutes.post("/generateTemplatePayload", (req, res) => {
  try {
    const { templateName, category, language, headerType, bodyText, footerText, buttons } = req.body;

    if (!templateName || !category || !language || !bodyText) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const templatePayload = {
      name: templateName,
      category,
      language: language,
      components: [],
    };

    if (headerType) {
      templatePayload.components.push({
        type: "header",
        format: headerType, // e.g., "IMAGE", "VIDEO", "DOCUMENT"
      });
    }

    if (bodyText) {
      templatePayload.components.push({
        type: "body",
        text: bodyText,
      });
    }

    if (footerText) {
      templatePayload.components.push({
        type: "footer",
        text: footerText,
      });
    }

    if (buttons) {
      templatePayload.components.push({
        type: "buttons",
        buttons: buttons.map((button, index) => ({
          type: button.type, // "QUICK_REPLY" or "URL"
          text: button.text,
          index,
        })),
      });
    }

    res.status(200).json({ templatePayload });
  } catch (error) {
    console.error("Error generating template payload:", error.message);
    res.status(500).json({ error: "Failed to generate template payload" });
  }
});


module.exports = whatsAppRoutes;
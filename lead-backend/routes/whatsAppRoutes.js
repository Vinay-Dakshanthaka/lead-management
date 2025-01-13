const express = require('express');
const whatsAppRoutes = express.Router();
const axios = require('axios');
const whatsAppController = require('../controller/whatsAppController');
const FormData = require("form-data");
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middlewares/authenticateToken')
const { v4: uuidv4 } = require('uuid');
const tmp = require('tmp');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  },
});

const db = require('../models');
const Counsellor = db.Counsellor
const AdminConfig = db.AdminConfig
// Initialize Multer
const upload = multer();


// whatsAppRoutes.post('/create-template', whatsAppController.createWhatsAppTemplate);
whatsAppRoutes.post('/create-template', whatsAppController.createWhatsAppTemplate);
whatsAppRoutes.post('/upload-media', upload.single('image'), whatsAppController.uploadMediaToWhatsApp);
whatsAppRoutes.post('/registerPhoneNumber', whatsAppController.registerPhoneNumber);
whatsAppRoutes.post('/sendMediaTemplateMessage', authenticateToken, whatsAppController.sendMediaTemplateMessage);
whatsAppRoutes.post('/sendMediaTemplateWithButton', whatsAppController.sendMediaTemplateWithButton);
whatsAppRoutes.post('/sendLaraJan2025BatchTemplate', authenticateToken, whatsAppController.sendLaraJan2025BatchTemplate);
whatsAppRoutes.post('/sendVideoTemplate', whatsAppController.sendVideoTemplate);
whatsAppRoutes.post('/uploadTemplateImage', upload.single('image'), authenticateToken, whatsAppController.uploadTemplateImage);
whatsAppRoutes.post('/uploadTemplateMedia', upload.single('file'), authenticateToken, whatsAppController.uploadTemplateMedia);

whatsAppRoutes.get('/getAllTemplateImages', whatsAppController.getAllTemplateImages);
whatsAppRoutes.get('/getTemplateImageById/:id', whatsAppController.getTemplateImageById);
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


// whatsAppRoutes.get("/listWhatsAppTemplates",authenticateToken, async (req, res) => {
//   try {
//     const counsellor_id = req.counsellor_id;

//     const user = await Counsellor.findByPk(counsellor_id);

//     if (!user) {
//       return res.status(404).send({ message : "No user found" });
//   }

//     const response = await axios.get(
//       `https://graph.facebook.com/v21.0/${process.env.BUSINESS_ID}/message_templates`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//         },
//       }
//     );
//     console.log("Template List :",response.data)

//     res.status(200).json({ templates: response.data });
//   } catch (error) {
//     console.error("Error fetching templates:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to fetch WhatsApp templates" });
//   }
// });


whatsAppRoutes.get("/listWhatsAppTemplates", authenticateToken, async (req, res) => {
  try {
    const userId = req.counsellor_id;
    console.log("requested user :: ", userId)

    let adminConfigData;
    const user = await Counsellor.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }



    if (user.role === 'COUNSELLOR') {
      console.log("user role ::: ", user.role)

      console.log("user found :: ", user.assigned_by)
      if (!user.assigned_by) {
        return res.status(403).send({ message: "Access Forbidden. No Admin found for this counsellor" })
      }
      const counsellorAdmin = await Counsellor.findOne(
        {
          where: {
            assigned_by: user.assigned_by,
          }
        }
      )


      console.log("counsellorAdmin found =======", counsellorAdmin)


      adminConfigData = await AdminConfig.findOne({
        where: {
          counsellor_id: counsellorAdmin.assigned_by
        }
      })

      if (!adminConfigData) {
        return res.status(401).send({ message: 'Unauthorized : No config for the asssigned admin.' })
      }

      console.log("amdin config data :: ", adminConfigData)
    }

    if (user.role === 'ADMIN') {
      adminConfigData = await AdminConfig.findOne({
        where: {
          counsellor_id: user.counsellor_id
        }
      })
      if (!adminConfigData) {
        return res.status(401).send({ message: 'Unauthorized : No config for this admin.' })
      }

    }


    // Fetch the user details
    // const user = await Counsellor.findOne({
    //   where: { counsellor_id: counsellor_id },
    // });

    // if (!user) {
    //   return res.status(404).send({ message: "No user found" });
    // }

    // // Fetch the configuration for the counsellor/admin
    // const adminConfig = await AdminConfig.findOne({
    //   where: { counsellor_id: counsellor_id },
    // });

    // if (!adminConfig) {
    //   return res.status(404).send({ message: "Configuration not found for this admin" });
    // }

    // const { whatsapp_token, business_id } = adminConfig;

    const business_id = adminConfigData.business_id;
    const whatsapp_token = adminConfigData.whatsapp_token;
    // Make the API call to get the WhatsApp templates

    const response = await axios.get(
      `https://graph.facebook.com/v21.0/${business_id}/message_templates`,
      {
        headers: {
          Authorization: `Bearer ${whatsapp_token}`,
        },
      }
    );

    console.log("Template List:", response.data);

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



whatsAppRoutes.post('/upload-template-with-image', async (req, res) => {

  const counsellor_id = req.counsellor_id;

  // Fetch the user details
  const user = await Counsellor.findOne({
    where: { counsellor_id: counsellor_id },
  });

  if (!user) {
    return res.status(404).send({ message: "No user found" });
  }

  // Fetch the configuration for the counsellor/admin
  const adminConfig = await AdminConfig.findOne({
    where: { counsellor_id: counsellor_id },
  });

  if (!adminConfig) {
    return res.status(404).send({ message: "Configuration not found for this admin" });
  }

  const APP_ID = adminConfig.app_id;
  const USER_ACCESS_TOKEN = adminConfig.whatsapp_token;
  const GRAPH_API_URL = 'https://graph.facebook.com/v21.0';

  const { imageUrl, templateName, bodyText } = req.body;

  // Validate the request data
  if (!imageUrl || !templateName || !bodyText) {
    return res.status(400).json({ error: 'imageUrl, templateName, and bodyText are required' });
  }

  try {
    // Step 1: Download the image from the URL
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    const tempFile = tmp.fileSync({ postfix: path.extname(imageUrl) });
    const localFilePath = tempFile.name;

    // Save the image to a local file
    await new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(localFilePath);
      response.data.pipe(fileStream);
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    console.log(`Image downloaded to ${localFilePath}`);

    // Step 2: Upload the image to Meta
    const imageFileType = getFileType(localFilePath);

    if (!imageFileType) {
      throw new Error('Invalid image file type');
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(localFilePath));
    formData.append('messaging_product', 'whatsapp');
    formData.append('type', imageFileType);

    // Upload image to Meta
    const mediaUploadResponse = await axios.post(
      `${GRAPH_API_URL}/${APP_ID}/media`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${USER_ACCESS_TOKEN}`,
          ...formData.getHeaders(),
        },
      }
    );

    const mediaId = mediaUploadResponse.data.id;
    console.log('Media ID:', mediaId);

    // Step 3: Create the template with the uploaded image
    const templateResponse = await axios.post(
      `${GRAPH_API_URL}/${APP_ID}/message_templates`,
      {
        name: templateName,
        language: {
          code: 'en_US',
        },
        category: 'MARKETING',
        components: [
          {
            type: 'HEADER',
            format: 'IMAGE',
            example: {
              header_handle: mediaId,
            },
          },
          {
            type: 'BODY',
            text: bodyText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${USER_ACCESS_TOKEN}`,
        },
      }
    );

    console.log('Template Created:', templateResponse.data);

    // Clean up the temporary file after uploading
    fs.unlinkSync(localFilePath);

    // Respond with success message
    res.status(200).json({
      message: 'Template with image created and sent for approval',
      data: templateResponse.data,
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);

    // Handle error and send response
    res.status(500).json({
      error: 'Failed to upload template with image',
      reason: error.response?.data?.error?.message || error.message,
    });
  }
});

// Helper function to determine the file type from the file extension
function getFileType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpeg':
    case '.jpg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    default:
      return null;
  }
}


module.exports = whatsAppRoutes;
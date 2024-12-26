const axios = require('axios');
require('dotenv').config();
const FormData = require("form-data");
const s3 = require('../config/digitalOceanConfig');
const { v4: uuidv4 } = require('uuid');
const db = require('../models');

const TemplateImage = db.TemplateImage;

const createWhatsAppTemplate = async (req, res) => {
    try {
        const accessToken = process.env.WHATSAPP_TOKEN; // Your WhatsApp API token
        const businessId = process.env.BUSINESS_ID; // Your business account ID

        // Extract template data from the request body
        const { name, category, language, bodyText, buttons } = req.body;

        // Validate required fields
        if (!name || !category || !language || !bodyText || !buttons || buttons.length === 0) {
            return res.status(400).json({ error: "All required fields (name, category, language, bodyText, buttons) must be provided." });
        }

        // Validate button count
        if (buttons.length > 2) {
            return res.status(400).json({ error: "A maximum of two buttons are allowed." });
        }

        // Prepare template payload
        const templateData = {
            name,
            category,
            allow_category_change: true,
            language,
            components: [
                {
                    type: "BODY", // Text body with placeholders
                    text: bodyText,
                },
                {
                    type: "BUTTONS", // Action buttons
                    buttons: buttons.map((buttonText) => ({
                        type: "QUICK_REPLY", // Button type
                        text: buttonText, // Button text
                    })),
                },
            ],
        };

        // API request to create the template
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${businessId}/message_templates`,
            templateData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Template created successfully:", response.data);
        return res.status(200).json({ message: "Template created successfully", data: response.data });
    } catch (error) {
        console.error("Error creating template:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Failed to create template", details: error.response?.data });
    }
};

// const createWhatsAppTemplate = async (req, res) => {
//     try {
//         const accessToken = process.env.WHATSAPP_TOKEN; // Your WhatsApp API token
//         const businessId = process.env.BUSINESS_ID; // Your business account ID
//         const appId = process.env.APP_ID; // Your Meta App ID

//         // Extract body text and buttons from the request
//         const { bodyText, buttons } = req.body;

//         if (!bodyText) {
//             return res.status(400).json({
//                 error: "Missing required field: bodyText",
//             });
//         }

//         if (!req.file) {
//             return res.status(400).json({
//                 error: "Missing required field: image",
//             });
//         }

//         const imagePath = req.file.path; // Path to the uploaded image
//         const imageName = req.file.filename; // Name of the uploaded image
//         const fileType = req.file.mimetype; // MIME type of the uploaded image
//         const fileLength = require('fs').statSync(imagePath).size; // Get file size

//         // Step 1: Start an upload session
//         const uploadSessionResponse = await axios.post(
//             `https://graph.facebook.com/v21.0/${appId}/uploads`,
//             null,
//             {
//                 params: {
//                     file_name: imageName,
//                     file_length: fileLength,
//                     file_type: fileType,
//                     access_token: accessToken,
//                 },
//             }
//         );

//         const uploadSessionId = uploadSessionResponse.data.id; // Upload session ID
//         console.log("Upload session started:", uploadSessionId);

//         // Step 2: Upload the image to Facebook
//         const fileHandleResponse = await axios.post(
//             `https://graph.facebook.com/v21.0/${uploadSessionId}`,
//             require('fs').readFileSync(imagePath),
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/octet-stream",
//                     file_offset: 0,
//                 },
//             }
//         );

//         const uploadedFileHandle = fileHandleResponse.data.h; // File handle
//         console.log("File uploaded successfully. Handle:", uploadedFileHandle);

//         // Step 3: Create the template
//         const templateData = {
//             name: "dynamic_template_with_image",
//             category: "UTILITY",
//             allow_category_change: true,
//             language: "en_US",
//             components: [
//                 {
//                     type: "BODY",
//                     text: bodyText,
//                 },
//                 {
//                     type: "IMAGE",
//                     image: {
//                         handle: uploadedFileHandle, // Use the file handle obtained from the upload
//                     },
//                 },
//                 {
//                     type: "BUTTONS",
//                     buttons: buttons ? JSON.parse(buttons) : [
//                         {
//                             type: "QUICK_REPLY",
//                             text: "I'm Interested",
//                         },
//                         {
//                             type: "QUICK_REPLY",
//                             text: "Maybe Later",
//                         },
//                     ],
//                 },
//             ],
//         };

//         const templateResponse = await axios.post(
//             `https://graph.facebook.com/v21.0/${businessId}/message_templates`,
//             templateData,
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         console.log("Template created successfully:", templateResponse.data);
//         return res.status(200).json({ message: "Template created successfully", data: templateResponse.data });
//     } catch (error) {
//         console.error("Error creating template:", error.response ? error.response.data : error.message);
//         return res.status(500).json({ error: "Failed to create template", details: error.response?.data });
//     }
// };

// template with image 

// const createWhatsAppTemplate = async (req, res) => {
//     try {
//       const accessToken = process.env.WHATSAPP_TOKEN; // Your WhatsApp API token
//       const phoneNumberId = process.env.PHONE_NUMBER_ID; // Your business phone number ID
  
//       // Extract template data from the request body
//       const { to, templateName, language, imageUrl, bodyText } = req.body;
  
//       // Validate required fields
//       if (!to || !templateName || !language || !imageUrl || !bodyText) {
//         return res.status(400).json({
//           error: "All required fields (to, templateName, language, imageUrl, bodyText) must be provided.",
//         });
//       }
  
//       // Prepare payload for sending the template message
//       const payload = {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to,
//         type: "template",
//         template: {
//           name: templateName,
//           language: {
//             code: language, // E.g., 'en_US'
//           },
//           components: [
//             {
//               type: "header",
//               parameters: [
//                 {
//                   type: "image",
//                   image: {
//                     link: imageUrl, // Pass the image URL here
//                   },
//                 },
//               ],
//             },
//             {
//               type: "body",
//               parameters: [
//                 {
//                   type: "text",
//                   text: bodyText, // Body text with placeholders
//                 },
//               ],
//             },
//           ],
//         },
//       };
  
//       // API request to send the message
//       const response = await axios.post(
//         `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       console.log("Template sent successfully:", response.data);
//       return res.status(200).json({
//         message: "Template sent successfully",
//         data: response.data,
//       });
//     } catch (error) {
//       console.error("Error sending template:", error.response?.data || error.message);
//       return res.status(500).json({
//         error: "Failed to send template",
//         details: error.response?.data || error.message,
//       });
//     }
//   };

  const uploadMediaToWhatsApp = async (req, res) => {
    try {
      const { file } = req;
  
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      const accessToken = process.env.WHATSAPP_TOKEN;
      const formData = new FormData();
  
      // Append the file to the form data
      formData.append("file", file.buffer, file.originalname);
      formData.append("type", file.mimetype);
  
      const response = await axios.post(
        `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...formData.getHeaders(),
          },
        }
      );
  
      console.log("Media uploaded successfully:", response.data);
      return res.status(200).json({ mediaId: response.data.id });
    } catch (error) {
      console.error("Error uploading media:", error.response?.data || error.message);
      return res.status(500).json({
        error: "Failed to upload media",
        details: error.response?.data || error.message,
      });
    }
  };
  
const checkTemplateStatus = async (req, res) => {
    try {
        const { templateName } = req.body; // Expecting the template name in the request body
        const accessToken = process.env.WHATSAPP_TOKEN; // WhatsApp API token
        const businessId = process.env.BUSINESS_ID; // WhatsApp Business Account ID

        // API request to fetch all message templates
        const response = await axios.get(
            `https://graph.facebook.com/v21.0/${businessId}/message_templates`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Search for the template by name
        const template = response.data.data.find((tmpl) => tmpl.name === templateName);

        if (template) {
            // Template found, return its status
            return res.status(200).json({
                success: true,
                message: `Template "${templateName}" found.`,
                status: template.status,
            });
        } else {
            // Template not found
            return res.status(404).json({
                success: false,
                message: `Template "${templateName}" not found.`,
            });
        }
    } catch (error) {
        console.error("Error checking template status:", error.response ? error.response.data : error.message);

        // Handle errors and send appropriate response
        return res.status(500).json({
            success: false,
            message: "Failed to check template status.",
            error: error.response?.data || error.message,
        });
    }
};

const registerPhoneNumber = async (req, res) => {
  try {
    const { pin } = req.body; // Expecting the PIN in the request body
    const accessToken = process.env.WHATSAPP_TOKEN; // WhatsApp API token
    const businessPhoneNumberId = process.env.PHONE_NUMBER_ID; // WhatsApp Business Phone Number ID

    const url = `https://graph.facebook.com/v21.0/${businessPhoneNumberId}/register`;

    const data = {
      messaging_product: 'whatsapp',
      pin: pin || '135790' // Use provided PIN or default to ''
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    };

    const response = await axios.post(url, data, { headers });

    if (response.data.success) {
      return res.status(200).json({
        success: true,
        message: 'Phone number registered successfully!',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to register the phone number.',
        data: response.data
      });
    }
  } catch (error) {
    console.error('Error registering phone number:', error.response ? error.response.data : error.message);

    return res.status(500).json({
      success: false,
      message: 'Error registering phone number.',
      error: error.response?.data || error.message
    });
  }
};


const sendMediaTemplateMessage = async (req, res) => {
    try {
        const {
            to,
            templateName,
            languageCode,
            imageUrl,
            textBody,
            currencyCode,
            amount,
            fallbackDate,
        } = req.body; // Destructure necessary data from the request body

        const accessToken = process.env.WHATSAPP_TOKEN; // WhatsApp API token
        const phoneNumberId = process.env.PHONE_NUMBER_ID; // WhatsApp Business Phone Number ID

        // Construct the payload
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: languageCode,
                },
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "image",
                                image: {
                                    link: imageUrl,
                                },
                            },
                        ],
                    },
                    {
                        type: "body",
                        // parameters: [
                        //     {
                        //         type: "text",
                        //         text: textBody,
                        //     },
                        //     {
                        //         type: "currency",
                        //         currency: {
                        //             fallback_value: `${currencyCode} ${amount / 1000}`,
                        //             code: currencyCode,
                        //             amount_1000: amount,
                        //         },
                        //     },
                        //     {
                        //         type: "date_time",
                        //         date_time: {
                        //             fallback_value: fallbackDate,
                        //         },
                        //     },
                        // ],
                    },
                ],
            },
        };

        // Make the POST request
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Return a success response
        return res.status(200).json({
            success: true,
            message: "Media template message sent successfully.",
            response: response.data,
        });
    } catch (error) {
        console.error("Error sending media template message:", error.response ? error.response.data : error.message);

        // Handle errors and send appropriate response
        return res.status(500).json({
            success: false,
            message: "Failed to send media template message.",
            error: error.response?.data || error.message,
        });
    }
};


const sendMediaTemplateWithButton = async (req, res) => {
    try {
        const {
            to,
            templateName,
            languageCode,
            imageUrl,
            userName = "there", // Default to "there" if no userName is provided
            websiteLink = "https://lara.co.in",
        } = req.body; // Destructure necessary data from the request body

        const accessToken = process.env.WHATSAPP_TOKEN; // WhatsApp API token
        const phoneNumberId = process.env.PHONE_NUMBER_ID; // WhatsApp Business Phone Number ID

        // Construct the payload
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: languageCode,
                },
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "image",
                                image: {
                                    link: imageUrl,
                                },
                            },
                        ],
                    },
                    {
                        type: "body",
                        parameters: [
                            {
                                type: "text",
                                text: `Hello ${userName}!`,
                            },
                            {
                                type: "text",
                                text: websiteLink,
                            },
                        ],
                    },
                    // {
                    //     type: "button",
                    //     sub_type: "url",
                    //     index: "0",
                    //     parameters: [
                    //         {
                    //             type: "text",
                    //             text: websiteLink,
                    //         },
                    //     ],
                    // },
                ],
            },
        };

        // Make the POST request
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Return a success response
        return res.status(200).json({
            success: true,
            message: "Media template message with button sent successfully.",
            response: response.data,
        });
    } catch (error) {
        console.error(
            "Error sending media template message with button:",
            error.response ? error.response.data : error.message
        );

        // Handle errors and send appropriate response
        return res.status(500).json({
            success: false,
            message: "Failed to send media template message with button.",
            error: error.response?.data || error.message,
        });
    }
};

const sendLaraJan2025BatchTemplate = async (req, res) => {
    try {
        const {
            to,
            templateName,
            languageCode,
            imageUrl,
        } = req.body; // Destructure necessary data from the request body

        const accessToken = process.env.WHATSAPP_TOKEN; // WhatsApp API token
        const phoneNumberId = process.env.PHONE_NUMBER_ID; // WhatsApp Business Phone Number ID

        // Construct the payload
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: languageCode,
                },
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "image",
                                image: {
                                    link: imageUrl,
                                },
                            },
                        ],
                    },
                    {
                        type: "body",
                        // parameters: [
                        //     {
                        //         type: "text",
                        //         text: `Hello ${userName}!`,
                        //     },
                        //     {
                        //         type: "text",
                        //         text: websiteLink,
                        //     },
                        // ],
                    },
                    // {
                    //     type: "button",
                    //     sub_type: "url",
                    //     index: "0",
                    //     parameters: [
                    //         {
                    //             type: "text",
                    //             text: websiteLink,
                    //         },
                    //     ],
                    // },
                ],
            },
        };

        // Make the POST request
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Return a success response
        return res.status(200).json({
            success: true,
            message: "Media template message with button sent successfully.",
            response: response.data,
        });
    } catch (error) {
        console.error(
            "Error sending media template message with button:",
            error.response ? error.response.data : error.message
        );

        // Handle errors and send appropriate response
        return res.status(500).json({
            success: false,
            message: "Failed to send media template message with button.",
            error: error.response?.data || error.message,
        });
    }
};

const sendVideoTemplate = async (req, res) => {
    try {
        const {
            to,
            templateName,
            languageCode,
            videoUrl,
        } = req.body; // Destructure necessary data from the request body

        const accessToken = process.env.WHATSAPP_TOKEN; // WhatsApp API token
        const phoneNumberId = process.env.PHONE_NUMBER_ID; // WhatsApp Business Phone Number ID

        // Construct the payload
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: languageCode,
                },
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "video",
                                video: {
                                    link: videoUrl,
                                },
                            },
                        ],
                    },
                    {
                        type: "body",
                        // parameters: [
                        //     {
                        //         type: "text",
                        //         text: `Hello ${userName}!`,
                        //     },
                        //     {
                        //         type: "text",
                        //         text: websiteLink,
                        //     },
                        // ],
                    },
                    // {
                    //     type: "button",
                    //     sub_type: "url",
                    //     index: "0",
                    //     parameters: [
                    //         {
                    //             type: "text",
                    //             text: websiteLink,
                    //         },
                    //     ],
                    // },
                ],
            },
        };

        // Make the POST request
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Return a success response
        return res.status(200).json({
            success: true,
            message: "Media template message with video sent successfully.",
            response: response.data,
        });
    } catch (error) {
        console.error(
            "Error sending media template message with video:",
            error.response ? error.response.data : error.message
        );

        // Handle errors and send appropriate response
        return res.status(500).json({
            success: false,
            message: "Failed to send media template message with video.",
            error: error.response?.data || error.message,
        });
    }
};



const uploadTemplateImage = async (req, res, next) => {
    const counsellor_id = req.counsellor_id;
    const {  template_name } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!counsellor_id || !template_name) {
        return res.status(400).json({ message: 'Counsellor ID and template name are required' });
    }

    try {
        // Generate S3 file key
        const clientName = process.env.CLIENT_NAME || 'default_client';
        const fileKey = `${clientName}/template_images/${uuidv4()}_${req.file.originalname.replace(/\s+/g, '')}`;

        // Upload file to S3
        const params = {
            Bucket: 'real_estate', // Bucket Name
            Key: fileKey,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: req.file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();

        // Uploaded file URL
        const imageUrl = uploadResult.Location;

        // Save image data in TemplateImage model
        const templateImage = await TemplateImage.create({
            counsellor_id,
            template_name,
            image_url: imageUrl,
        });

        return res.status(200).json({
            message: 'Template image uploaded and saved successfully',
            templateImage,
        });
    } catch (error) {
        console.error('Error uploading template image:', error);
        next(error);
    }
};

const uploadTemplateVideo = async (req, res, next) => {
    const counsellor_id = req.counsellor_id;
    const { template_name } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!counsellor_id || !template_name) {
        return res.status(400).json({ message: 'Counsellor ID and template name are required' });
    }

    try {
        // Generate file key for DigitalOcean Spaces
        const clientName = process.env.CLIENT_NAME || 'default_client';
        const fileKey = `${clientName}/template_videos/${uuidv4()}_${req.file.originalname.replace(/\s+/g, '')}`;

        // Upload video to DigitalOcean Spaces
        const params = {
            Bucket: 'real_estate', //Bucket name 
            Key: fileKey,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: req.file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();

        // Retrieve the uploaded video's URL
        const videoUrl = uploadResult.Location;

        // Save video data in TemplateVideo model
        const templateImage = await TemplateImage.create({
            counsellor_id,
            template_name,
            video_url: videoUrl,
        });

        return res.status(200).json({
            message: 'Template video uploaded and saved successfully',
            templateImage,
        });
    } catch (error) {
        console.error('Error uploading template video:', error);
        next(error);
    }
};

const uploadTemplateMedia = async (req, res, next) => {
    const counsellor_id = req.counsellor_id;
    const { template_name } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!counsellor_id || !template_name) {
        return res.status(400).json({ message: 'Counsellor ID and template name are required' });
    }

    try {
        // Determine file type (image or video) and set folder accordingly
        const isImage = req.file.mimetype.startsWith('image/');
        const isVideo = req.file.mimetype.startsWith('video/');

        if (!isImage && !isVideo) {
            return res.status(400).json({ message: 'Unsupported file type. Only images and videos are allowed.' });
        }

        const clientName = process.env.CLIENT_NAME || 'default_client';
        const folder = isImage ? 'template_images' : 'template_videos';
        const fileKey = `${clientName}/${folder}/${uuidv4()}_${req.file.originalname.replace(/\s+/g, '')}`;

        // Upload file to S3
        const params = {
            Bucket: 'real_estate', // Bucket Name
            Key: fileKey,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: req.file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();

        // Uploaded file URL
        const fileUrl = uploadResult.Location;

        // Save file data in TemplateMedia model
        const templateMedia = await TemplateImage.create({
            counsellor_id,
            template_name,
            image_url: fileUrl,
            // file_type: isImage ? 'IMAGE' : 'VIDEO',
        });

        return res.status(200).json({
            message: `${isImage ? 'Image' : 'Video'} uploaded and saved successfully`,
            templateMedia,
        });
    } catch (error) {
        console.error('Error uploading template media:', error);
        next(error);
    }
};


const getAllTemplateImages = async (req, res, next) => {
    try {
        // Fetch all records from TemplateImage table
        const templateImages = await TemplateImage.findAll();

        if (!templateImages || templateImages.length === 0) {
            return res.status(404).json({ message: 'No template images found' });
        }

        return res.status(200).json({
            message: 'Template images retrieved successfully',
            templateImages,
        });
    } catch (error) {
        console.error('Error fetching template images:', error);
        next(error);
    }
};

const getTemplateImageById = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Template image ID is required' });
    }

    try {
        // Fetch the template image by ID
        const templateImage = await TemplateImage.findByPk(id);

        if (!templateImage) {
            return res.status(404).json({ message: 'Template image not found' });
        }

        return res.status(200).json({
            message: 'Template image retrieved successfully',
            templateImage,
        });
    } catch (error) {
        console.error('Error fetching template image by ID:', error);
        next(error);
    }
};

const getTemplateImagesByCounsellorId = async (req, res, next) => {
    const counsellor_id  = req.counsellor_id;
    console.log("counselllor id :", counsellor_id)
    if (!counsellor_id) {
        return res.status(400).json({ message: 'Counsellor ID is required' });
    }

    try {
        // Fetch all template images by counsellor ID
        const templateImages = await TemplateImage.findAll({
            where: { counsellor_id },
        });

        if (templateImages.length === 0) {
            return res.status(404).json({ message: 'No template images found for the specified counsellor' });
        }

        return res.status(200).json({
            message: 'Template images retrieved successfully',
            templateImages,
        });
    } catch (error) {
        console.error('Error fetching template images by counsellor ID:', error);
        next(error);
    }
};



module.exports = {
    createWhatsAppTemplate,
    checkTemplateStatus,
    uploadMediaToWhatsApp,
    sendLaraJan2025BatchTemplate,
    registerPhoneNumber,
    sendMediaTemplateMessage,
    sendMediaTemplateWithButton,
    uploadTemplateImage,
    uploadTemplateVideo,
    uploadTemplateMedia,
    getAllTemplateImages,
    getTemplateImageById,
    getTemplateImagesByCounsellorId,
    sendVideoTemplate
};

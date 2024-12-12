const axios = require('axios');
require('dotenv').config();

const createWhatsAppTemplate = async (req, res) => {
    try {
        const accessToken = process.env.WHATSAPP_TOKEN;
        const businessId = process.env.BUSINESS_ID;

        // Define the template payload
        const templateData = {
            name: "lara_tech_java_fullstack", // Template name (lowercase, underscores allowed)
            language: { code: "en_US" }, // Language code
            components: [
                {
                    type: "HEADER",
                    format: "TEXT",
                    text: "Welcome to Lara Technologies!"
                },
                {
                    type: "BODY",
                    text: "Join our Java Full Stack Development course to kickstart your IT career. Enhance your skills with expert guidance and practical projects."
                },
                {
                    type: "FOOTER",
                    text: "Contact us for more information."
                },
                {
                    type: "BUTTONS",
                    buttons: [
                        {
                            type: "QUICK_REPLY",
                            text: "ENROLL NOW"
                        },
                        {
                            type: "QUICK_REPLY",
                            text: "MORE INFO"
                        }
                    ]
                }
            ],
            category: "UTILITY"
        };

        // Make a POST request to Meta's Graph API
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${businessId}/message_templates`,
            templateData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Template Created:", response.data);

        // Return success response
        return res.status(200).json({ message: "WhatsApp template created successfully", data: response.data });
    } catch (error) {
        console.error("Error Creating Template:", error.response ? error.response.data : error.message);
        console.error("Error", error)

        // Return error response
        return res.status(500).json({ error: "Failed to create WhatsApp template", details: error.response ? error.response.data : error.message });
    }
};


const checkTemplateStatus = async (templateName) => {
    try {
        const accessToken = process.env.WHATSAPP_TOKEN;
        const businessId = process.env.BUSINESS_ID;

        // API Request to Get Template Status
        const response = await axios.get(
            `https://graph.facebook.com/v20.0/${businessId}/message_templates`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const template = response.data.data.find((tmpl) => tmpl.name === templateName);

        if (template) {
            console.log(`Template Status for "${templateName}":`, template.status);
            return template.status;
        } else {
            console.log(`Template "${templateName}" not found.`);
            return null;
        }
    } catch (error) {
        console.error("Error Checking Template Status:", error.response ? error.response.data : error.message);
        throw error;
    }
};

checkTemplateStatus("test_template")


module.exports = {
    createWhatsAppTemplate,
    checkTemplateStatus,
};

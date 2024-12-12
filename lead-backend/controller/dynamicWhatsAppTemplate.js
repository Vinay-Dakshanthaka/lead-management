  const axios = require('axios');
  require('dotenv').config();

  const createWhatsAppTemplate = async () => {
    const accessToken = process.env.WHATSAPP_TOKEN;
    const businessId = process.env.BUSINESS_ID;

    // Define the template payload
    const templateData = {
      name: "dynamic_template_example", // Template name (lowercase, underscores allowed)
      language: { code: "en_US" }, // Language code
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "Hello {{1}}!"
        },
        {
          type: "BODY",
          text: "Your order {{2}} has been shipped and will arrive by {{3}}."
        },
        {
          type: "FOOTER",
          text: "Thank you for shopping with us."
        },
        {
          type: "BUTTONS",
          buttons: [
            {
              type: "QUICK_REPLY",
              text: "Track Order"
            },
            {
              type: "QUICK_REPLY",
              text: "Contact Support"
            }
          ]
        }
      ],
      category: "TRANSACTIONAL"
    };

    try {
      // Make a POST request to Meta's Graph API
      const response = await axios.post(
        `https://graph.facebook.com/v15.0/${businessId}/message_templates`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Template Created:", response.data);
    } catch (error) {
      console.error("Error Creating Template:", error.response.data);
    }
  };

  createWhatsAppTemplate();

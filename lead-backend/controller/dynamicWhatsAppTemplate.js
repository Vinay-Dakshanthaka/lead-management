  const axios = require('axios');
  require('dotenv').config();
  const authenticateToken  = require('../middlewares/authenticateToken')
  const jwt = require('jsonwebtoken');
const { Counsellor, AdminConfig } = require('../models'); // Assuming you have your models here

  const createWhatsAppTemplate = async () => {

 // 1. Extract the token from the Authorization header
 const token = req.header('Authorization')?.split(' ')[1]; // assuming it's "Bearer <token>"

 if (!token) {
   return res.status(401).send({ message: 'Access Denied: No token provided' });
 }

 // 2. Verify the token using JWT
 const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure to use your secret key

 // Now you have the decoded user info, e.g., userId
 const userId = decoded.counsellor_id;  // Assuming the token has counsellor_id
    // const userId = req.counsellor_id;
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
    const accessToken = adminConfigData.whats_app;
    const businessId = adminConfigData.business_id;

    // Define the template payload
    // const templateData = {
    //   name: "dynamic_template_example", // Template name (lowercase, underscores allowed)
    //   language: { code: "en_US" }, // Language code
    //   components: [
    //     {
    //       type: "HEADER",
    //       format: "TEXT",
    //       text: "Hello {{1}}!"
    //     },
    //     {
    //       type: "BODY",
    //       text: "Your order {{2}} has been shipped and will arrive by {{3}}."
    //     },
    //     {
    //       type: "FOOTER",
    //       text: "Thank you for shopping with us."
    //     },
    //     {
    //       type: "BUTTONS",
    //       buttons: [
    //         {
    //           type: "QUICK_REPLY",
    //           text: "Track Order"
    //         },
    //         {
    //           type: "QUICK_REPLY",
    //           text: "Contact Support"
    //         }
    //       ]
    //     }
    //   ],
    //   category: "TRANSACTIONAL"
    // };
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

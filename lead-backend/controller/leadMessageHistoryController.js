const db = require('../models');

// Controller to create a new LeadMessageHistory
const createLeadMessageHistory = async (req, res) => {
    const { lead_id, template_name, message_status } = req.body; // Destructure data from request body
     const msg_sentcount = 0;
    try {
        // Check if a record with lead_id and template_name exists
        const existingRecord = await db.LeadMessageHistory.findOne({ 
            where: { lead_id, template_name } 
        });

        if (existingRecord) {
            // If the record already exists, increment the count and update message_status
            await db.LeadMessageHistory.update(
                {
                    msg_sentcount: db.sequelize.literal('msg_sentcount + 1'), // Increment count in DB
                    message_status
                },
                {
                    where: { lead_id, template_name }
                }
            );

            return res.status(200).json({
                success: true,
                message: 'Lead message history updated successfully with incremented count',
                data: {
                    lead_id,
                    template_name,
                    message_status,
                   
                }
            });
        } else {
            // If the record does not exist, create a new entry
            const newMessageHistory = await db.LeadMessageHistory.create({
                lead_id,
                template_name,
                message_status,
                msg_sentcount: 0 // Initial count
            });

            return res.status(201).json({
                success: true,
                message: 'Lead message history created successfully',
                data: newMessageHistory
            });
        }

    } catch (error) {
        console.error('Error in createLeadMessageHistory:', error);

        return res.status(500).json({
            success: false,
            message: 'Error creating or updating LeadMessageHistory',
            error: error.message
        });
    }
};

// Controller to get message count based on template_name
const getMessageCountByTemplateName = async (req, res) => {
    const { template_name,lead_id } = req.params; // Extract template_name from URL parameters

    console.log(template_name, lead_id,"------------------------template_name");

    try {
        // Validate if template_name is provided
        if (!template_name && !lead_id) {
            return res.status(400).json({
                success: false,
                message: 'Template name is required'
            });
        }

        // Query to get the total message count for the given template_name
        const result = await db.LeadMessageHistory.findOne({
            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('msg_sentcount')), 'total_sent_count']
            ],
            where: { template_name,
                lead_id
             }
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `No records found for template: ${template_name}`
            });
        }

        // Send only the count
        return res.status(200).json({
            success: true,
            total_sent_count: result.get('total_sent_count') || 0
        });

    } catch (error) {
        console.error('Error in getMessageCountByTemplateName:', error);

        return res.status(500).json({
            success: false,
            message: 'Error retrieving message count for template',
            error: error.message
        });
    }
};






module.exports = {
    createLeadMessageHistory,
    getMessageCountByTemplateName,

};
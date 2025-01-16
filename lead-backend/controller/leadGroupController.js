const axios = require('axios');
require('dotenv').config();
const db = require('../models');

const WhatsAppLead = db.WhatsAppLead;
const LeadGroup = db.LeadGroup;
const LeadGroupMapping = db.LeadGroupMapping;
const Lead = db.Lead;
const Counsellor = db.Counsellor;

const createLeadGroup = async (req, res) => {
    try {
        const counsellor_id = req.counsellor_id; 
        const { group_name, description, lead_ids } = req.body;

        // Check if a group with the same name already exists
        let group = await LeadGroup.findOne({
            where: { group_name }
        });

        // If a group with the same name already exists, return an error
        if (group) {
            return res.status(409).send({ message: "Group with this name already exists" });
        }
        console.log("counsellor id : ", counsellor_id)
        // Create a new group
        group = await LeadGroup.create({
            group_name,
            description: description || null, 
            created_by : counsellor_id
        });

        // If lead IDs are provided, assign leads to the group
        if (lead_ids && lead_ids.length > 0) {
            const mappings = lead_ids.map((lead_id) => ({
                lead_id,
                group_id: group.group_id
            }));
            await LeadGroupMapping.bulkCreate(mappings);
        }

        return res.status(201).send({
            message: "Lead group created successfully",
            group
        });

    } catch (error) {
        console.error("Error creating lead group:", error);
        return res.status(500).send({ message: "Failed to create lead group", error });
    }
};

const getLeadsByGroup = async (req, res) => {
    try {
        const { group_id, group_name } = req.query;

        // Validate request
        if (!group_id && !group_name) {
            return res.status(400).send({ message: "Either group_id or group_name must be provided" });
        }

        const group = await LeadGroup.findOne({
            where: group_id ? { group_id } : { group_name },
            include: [
                {
                    model: LeadGroupMapping,
                    as:'LeadGroupMappings',
                    include: [
                        {
                            model: Lead,
                            as:'Lead',
                            attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status']
                        }
                    ]
                }
            ]
        });

        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }

        const leads = group.LeadGroupMappings.map(mapping => mapping.Lead);

        return res.status(200).send({
            message: "Leads retrieved successfully",
            group: {
                group_id: group.group_id,
                group_name: group.group_name,
                description: group.description
            },
            leads
        });
    } catch (error) {
        console.error("Error retrieving leads by group:", error);
        return res.status(500).send({ message: "Failed to retrieve leads by group", error });
    }
};

const assignLeadsToGroup = async (req, res) => {
    try {
        const { group_id, lead_ids } = req.body;

        // Validate request
        if (!group_id || !lead_ids || lead_ids.length === 0) {
            return res.status(400).send({ message: "group_id and lead_ids are required" });
        }

        // Check if the group exists
        const group = await LeadGroup.findOne({
            where: { group_id }
        });

        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }

        // Check for duplicate lead mappings
        const existingMappings = await LeadGroupMapping.findAll({
            where: { group_id, lead_id: lead_ids }
        });

        const existingLeadIds = existingMappings.map((mapping) => mapping.lead_id);

        // Filter out leads that are already assigned
        const newLeadIds = lead_ids.filter((lead_id) => !existingLeadIds.includes(lead_id));

        if (newLeadIds.length === 0) {
            return res.status(409).send({ message: "All leads are already assigned to this group" });
        }

        // Assign new leads to the group
        const mappings = newLeadIds.map((lead_id) => ({
            lead_id,
            group_id
        }));
        await LeadGroupMapping.bulkCreate(mappings);

        return res.status(200).send({
            message: "Leads assigned to group successfully",
            group: {
                group_id: group.group_id,
                group_name: group.group_name
            },
            assigned_lead_ids: newLeadIds
        });

    } catch (error) {
        console.error("Error assigning leads to group:", error);
        return res.status(500).send({ message: "Failed to assign leads to group", error });
    }
};

const updateLeadGroup = async (req, res) => {
    try {
        const { group_id, group_name, description, updated_by } = req.body;

        // Validate request
        if (!group_id && !group_name) {
            return res.status(400).send({ message: "Either group_id or group_name must be provided" });
        }

        // Find the group by ID or name
        const group = await LeadGroup.findOne({
            where: group_id ? { group_id } : { group_name }
        });

        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }

        // Update group details
        await group.update({
            description: description || group.description,
            updated_by: updated_by || group.updated_by,
            updated_at: new Date()
        });

        return res.status(200).send({
            message: "Group updated successfully",
            group
        });

    } catch (error) {
        console.error("Error updating lead group:", error);
        return res.status(500).send({ message: "Failed to update lead group", error });
    }
};

const deleteLeadGroup = async (req, res) => {
    try {
        const { group_id, group_name } = req.query;

        // Validate request
        if (!group_id && !group_name) {
            return res.status(400).send({ message: "Either group_id or group_name must be provided" });
        }

        // Find the group by ID or name
        const group = await LeadGroup.findOne({
            where: group_id ? { group_id } : { group_name }
        });

        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }

        // Delete group mappings first to maintain referential integrity
        await LeadGroupMapping.destroy({
            where: { group_id: group.group_id }
        });

        // Delete the group
        await group.destroy();

        return res.status(200).send({
            message: "Group deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting lead group:", error);
        return res.status(500).send({ message: "Failed to delete lead group", error });
    }
};

// const getAllLeadGroups = async (req, res) => {
//     try {
//         const counsellor_id = req.counsellor_id; 
//         // Fetch all groups
//         const groups = await LeadGroup.findAll({
//             include: [
//                 {
//                     model: LeadGroupMapping,
//                     as: 'LeadGroupMappings',
//                     include: [
//                         {
//                             model: Lead,
//                             as:'Lead',
//                             attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status']
//                         }
//                     ]
//                 }
//             ]
//         });

//         if (!groups || groups.length === 0) {
//             return res.status(404).send({ message: "No groups found" });
//         }

//         return res.status(200).send({
//             message: "Groups retrieved successfully",
//             groups
//         });

//     } catch (error) {
//         console.error("Error retrieving lead groups:", error);
//         return res.status(500).send({ message: "Failed to retrieve lead groups", error });
//     }
// };

const getAllLeadGroups = async (req, res) => {
    try {
        const counsellor_id = req.counsellor_id;

        // Fetch counsellor's role
        const counsellor = await Counsellor.findOne({
            where: { counsellor_id: counsellor_id },
            attributes: ['role'],
        });

        if (!counsellor) {
            return res.status(404).send({ message: "Counsellor not found" });
        }

        let groups;

        // Check the role and fetch groups accordingly
        if (counsellor.role === 'ADMIN') {
            // Admin can view all groups
            groups = await LeadGroup.findAll({
                include: [
                    {
                        model: Counsellor,
                        as: 'Creator', // Alias for the relationship
                        attributes: ['name', 'phone'], // Fetch counsellor's details
                    },
                    {
                        model: LeadGroupMapping,
                        as: 'LeadGroupMappings',
                        include: [
                            {
                                model: Lead,
                                as: 'Lead',
                                attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status'],
                            },
                        ],
                    },
                ],
            });
        } else if (counsellor.role === 'COUNSELLOR') {
            // Counsellor can view only their created groups
            groups = await LeadGroup.findAll({
                where: { created_by: counsellor_id },
                include: [
                    {
                        model: Counsellor,
                        as: 'Creator', // Alias for the relationship
                        attributes: ['name', 'phone'], // Fetch counsellor's details
                    },
                    {
                        model: LeadGroupMapping,
                        as: 'LeadGroupMappings',
                        include: [
                            {
                                model: Lead,
                                as: 'Lead',
                                attributes: ['lead_id', 'name', 'email', 'phone', 'joining_status'],
                            },
                        ],
                    },
                ],
            });
        } else {
            return res.status(403).send({ message: "Invalid role" });
        }

        if (!groups || groups.length === 0) {
            return res.status(404).send({ message: "No groups found" });
        }

        return res.status(200).send({
            message: "Groups retrieved successfully",
            groups,
        });
    } catch (error) {
        console.error("Error retrieving lead groups:", error);
        return res.status(500).send({ message: "Failed to retrieve lead groups", error });
    }
};

const getLeadGroupsByCreator = async (req, res) => {
    try {
        const created_by = req.counsellor_id; // Retrieve counsellor ID from the request

        // Fetch the role of the logged-in user
        const loggedInUser = await db.Counsellor.findOne({
            where: { counsellor_id: created_by },
            attributes: ["role"], // Fetch only the role field
        });

        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const userRole = loggedInUser.role;

        if (userRole === "ADMIN") {
            // Fetch all counsellors assigned by this admin
            const counsellors = await db.Counsellor.findAll({
                where: {
                    assigned_by: created_by,
                },
                attributes: ["counsellor_id"], // Fetch only the counsellor IDs
            });

            const counsellorIds = counsellors.map(counsellor => counsellor.counsellor_id);
            counsellorIds.push(created_by); // Include the admin's own ID

            // Fetch lead groups for admin and their assigned counsellors
            const leadGroups = await LeadGroup.findAll({
                where: {
                    created_by: counsellorIds, // Fetch groups created by the admin or their counsellors
                },
                include: [
                    {
                        model: db.Counsellor,
                        as: "Creator",
                        attributes: ["counsellor_id", "name", "email", "role"],
                    },
                ],
            });

            return res.status(200).json(leadGroups);
        } else if (userRole === "COUNSELLOR") {
            // Fetch groups created by this counsellor
            const leadGroups = await LeadGroup.findAll({
                where: {
                    created_by: created_by,
                },
                include: [
                    {
                        model: db.Counsellor,
                        as: "Creator",
                        attributes: ["counsellor_id", "name", "email", "role"],
                    },
                ],
            });

            if (leadGroups.length === 0) {
                return res.status(404).json({ message: "No groups found for the specified creator." });
            }

            return res.status(200).json(leadGroups);
        } else {
            return res.status(403).json({ message: "Unauthorized role." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching lead groups.", error });
    }
};






module.exports = {
    createLeadGroup,
    getLeadsByGroup,
    assignLeadsToGroup,
    updateLeadGroup,
    deleteLeadGroup,
    getAllLeadGroups,
    getLeadGroupsByCreator,
}
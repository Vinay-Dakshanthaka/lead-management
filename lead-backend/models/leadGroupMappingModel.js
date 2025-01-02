module.exports = (sequelize, DataTypes) => {
    const LeadGroupMapping = sequelize.define("LeadGroupMapping", {
        mapping_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lead_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Leads', // Refers to the 'Leads' table
                key: 'lead_id'
            },
            onDelete: 'CASCADE' // Delete mappings if a lead is deleted
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'LeadGroups', // Refers to the 'LeadGroups' table
                key: 'group_id'
            },
            onDelete: 'CASCADE' // Delete mappings if a group is deleted
        }
    }, {
        timestamps: false
    });

    return LeadGroupMapping;
};

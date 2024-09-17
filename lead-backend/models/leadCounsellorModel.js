module.exports = (sequelize, DataTypes) => {
    const LeadCounsellor = sequelize.define("LeadCounsellor", {
        lead_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Leads', // Name of the Lead table
                key: 'lead_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true
        },
        counsellor_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Counsellors', // Name of the Counsellor table
                key: 'counsellor_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true
        },
        assigned_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        response: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
        is_interested: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        contacted_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        next_contact_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_active: { //to know which councellor is active for a lead
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false  // Default to false; only one counsellor can be active at a time per lead
        },
        responsible_for_joining: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false  // This will be set to true for the counsellor who is responsible for the lead's joining
        }
    }, {
        timestamps: true
    });

    return LeadCounsellor;
};

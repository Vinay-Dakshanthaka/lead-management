module.exports = (sequelize, DataTypes) => {
    const LeadMessageHistory = sequelize.define("LeadMessageHistory", {
        message_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lead_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Leads', 
                key: 'lead_id'
            },
            onDelete: 'CASCADE' 
        },
        template_name: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        message_status: {
            type: DataTypes.STRING,
            allowNull: true 
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        msg_sentcount: {
            type: DataTypes.INTEGER,
            allowNull: true, // Can be null, should represent the number of messages sent
            // defaultValue: 0 // Default value of 0 to start with no messages sent
        }
    }, {
        timestamps: false
    });

    return LeadMessageHistory;
};
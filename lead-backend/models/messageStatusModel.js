module.exports = (sequelize, DataTypes) => {
    const MessageStatus = sequelize.define("MessageStatus", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        recipient_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false, // 'delivered', 'failed', etc.
        },
        timestamp: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        error_code: {
            type: DataTypes.INTEGER,
            allowNull: true, // Null for successful deliveries
        },
        error_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        error_message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        error_details: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
    });

    return MessageStatus;
};

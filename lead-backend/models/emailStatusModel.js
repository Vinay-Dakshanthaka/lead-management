module.exports = (sequelize, DataTypes) => {
    const EmailStatus = sequelize.define(
        "EmailStatus",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("SENT", "FAILED","PENDING"),
                allowNull: false,
            },
            error_message: {
                type: DataTypes.TEXT,
                allowNull: true, // Only applicable for failed emails
            },
            response: {
                type: DataTypes.JSON,
                allowNull: true, // Store email service response
            },
            taskId: {
                type: DataTypes.STRING,
                allowNull: false, // Used to track emails in a bulk task
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
            tableName: "email_status",
        }
    );

    return EmailStatus;
};

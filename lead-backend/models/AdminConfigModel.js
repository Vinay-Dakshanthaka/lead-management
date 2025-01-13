module.exports = (sequelize, DataTypes) => {
    const AdminConfig = sequelize.define("AdminConfig", {
        config_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        whatsapp_token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        check_token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        business_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        app_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        client_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        counsellor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Counsellors",
                key: "counsellor_id",
            },
        },
    }, {
        timestamps: true,
    });

    return AdminConfig;
};

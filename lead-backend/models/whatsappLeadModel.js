module.exports = (sequelize, DataTypes) => {
    const WhatsAppLead = sequelize.define("WhatsAppLead", {
        lead_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true // Add unique constraint for phone
        },
        place: {
            type: DataTypes.STRING,
            allowNull: true
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pin: {
            type: DataTypes.STRING,
            allowNull: true
        },
        college: {
            type: DataTypes.STRING,
            allowNull: true
        },
        university: {
            type: DataTypes.STRING,
            allowNull: true
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: true
        },
        year_of_passout: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: true
    });

    return WhatsAppLead;
};

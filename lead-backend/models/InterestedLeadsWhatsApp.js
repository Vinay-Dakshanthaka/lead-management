module.exports = (sequelize, DataTypes) => {
    const InterestedLeadsWhatsApp = sequelize.define("InterestedLeadsWhatsApp", {
        interested_lead_id: {
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
            unique: true 
        },
        college: {
            type: DataTypes.STRING,
            allowNull: true
        },
        place: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true
    });

    return InterestedLeadsWhatsApp;
};

module.exports = (sequelize, DataTypes) => {
    const Lead = sequelize.define("Lead", {
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
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true // Add unique constraint for phone
        },
        joining_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    }, {
        timestamps: true
    });

    return Lead;
};

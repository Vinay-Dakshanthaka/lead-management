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
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        response: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        contacted_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        next_contact_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        is_contacted_today: {  // field to track if contacted today
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        joining_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
    }, {
        timestamps: true
    });

    return Lead;
};

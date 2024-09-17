module.exports = (sequelize, DataTypes) => {
    const Counsellor = sequelize.define("Counsellor", {
        counsellor_id: {
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
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'COUNSELLOR'),
            allowNull: false,
            defaultValue: 'COUNSELLOR'
        },
        is_active: {  
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true 
        },
        password_updated: {  
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false 
        }
    }, {
        timestamps: true
    });

    return Counsellor;
};

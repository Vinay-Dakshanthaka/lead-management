// module.exports = (sequelize, DataTypes) => {
//     const Counsellor = sequelize.define("Counsellor", {
//         counsellor_id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         phone: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         role: {
//             type: DataTypes.ENUM('ADMIN', 'COUNSELLOR','SUPER ADMIN'),
//             allowNull: false,
//             defaultValue: 'COUNSELLOR'
//         },
//         is_active: {  
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: true 
//         },
//         password_updated: {  
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: false 
//         }
//     }, {
//         timestamps: true
//     });

//     return Counsellor;
// };


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
            type: DataTypes.ENUM("ADMIN", "COUNSELLOR", "SUPER ADMIN"),
            allowNull: false,
            defaultValue: "COUNSELLOR"
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
        },
        assigned_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Counsellors", // Self-referencing model
                key: "counsellor_id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        }
    }, {
        timestamps: true
    });

    return Counsellor;
};


// ALTER TABLE `lead_management`.`counsellors`
// ADD COLUMN `assigned_by` INT NULL AFTER `password_updated`,
// ADD CONSTRAINT `fk_assigned_by`
// FOREIGN KEY (`assigned_by`) REFERENCES `Counsellors`(`counsellor_id`)
// ON UPDATE CASCADE
// ON DELETE SET NULL;
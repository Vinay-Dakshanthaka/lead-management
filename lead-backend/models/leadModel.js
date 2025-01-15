// module.exports = (sequelize, DataTypes) => {
//     const Lead = sequelize.define("Lead", {
//         lead_id: {
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
//             allowNull: true,
//         },
//         phone: {
//             type: DataTypes.STRING,
//             allowNull: true,
//             unique: true // Add unique constraint for phone
//         },
//         joining_status: {
//             type: DataTypes.BOOLEAN,
//             allowNull: true,
//             defaultValue: false
//         }
//     }, {
//         timestamps: true
//     });

//     return Lead;
// };


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
            allowNull: true,
            // unique: true // Unique constraint for phone
        },
        joining_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        counsellor_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Counsellors", // Refers to the Counsellor model
                key: "counsellor_id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        }
    }, {
        timestamps: true
    });

    return Lead;
};


// ALTER TABLE `lead_management`.`Leads` 
// ADD COLUMN `counsellor_id` INT NULL AFTER `joining_status`,
// ADD CONSTRAINT `fk_counsellor_id`
// FOREIGN KEY (`counsellor_id`) REFERENCES `lead_management`.`Counsellors`(`counsellor_id`)
// ON UPDATE CASCADE
// ON DELETE SET NULL;
// to remove the uniqueconstraint
// ALTER TABLE lead_management.leads DROP INDEX phone_2;  

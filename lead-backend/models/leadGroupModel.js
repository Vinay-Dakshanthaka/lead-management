module.exports = (sequelize, DataTypes) => {
    const LeadGroup = sequelize.define("LeadGroup", {
        group_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        group_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // Ensure group names are unique
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field to describe the group
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Counsellors", // Refers to the Counsellor model
                key: "counsellor_id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true // To mark a group as active or inactive
        }
    }, {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    });

    return LeadGroup;
};

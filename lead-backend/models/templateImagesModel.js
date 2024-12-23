module.exports = (sequelize, DataTypes) => {
    const TemplateImage = sequelize.define("TemplateImage", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        counsellor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Counsellors', // Name of the model being referenced
                key: 'counsellor_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        template_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true // Adds createdAt and updatedAt columns
    });

    return TemplateImage;
};

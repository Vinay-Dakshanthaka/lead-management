const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

// Authenticate Sequelize
sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

// Initialize db object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Lead = require('./leadModel.js')(sequelize, DataTypes);
db.Counsellor = require('./counsellorModel.js')(sequelize, DataTypes);
db.LeadCounsellor = require('./leadCounsellorModel.js')(sequelize, DataTypes);
db.TemplateImage = require('./templateImagesModel.js')(sequelize, DataTypes);
db.WhatsAppLead = require('./whatsappLeadModel.js')(sequelize, DataTypes);
db.LeadGroup = require('./leadGroupModel.js')(sequelize, DataTypes);
db.LeadGroupMapping = require('./leadGroupMappingModel.js')(sequelize, DataTypes);
db.LeadMessageHistory = require('./leadMessageHistoryModel.js')(sequelize,DataTypes);


// Define many-to-many association
// Define associations in index.js or separate model files

// Lead and Counsellor association
db.Lead.belongsToMany(db.Counsellor, {
    through: db.LeadCounsellor,
    foreignKey: 'lead_id',
    otherKey: 'counsellor_id',
    as: 'counsellors' // Alias for the relationship
});

db.Counsellor.belongsToMany(db.Lead, {
    through: db.LeadCounsellor,
    foreignKey: 'counsellor_id',
    otherKey: 'lead_id',
    as: 'leads' // Alias for the relationship
});

// Define LeadCounsellor model associations
db.LeadCounsellor.belongsTo(db.Lead, { foreignKey: 'lead_id', as: 'Lead' });
db.LeadCounsellor.belongsTo(db.Counsellor, { foreignKey: 'counsellor_id', as: 'Counsellor' });

db.Lead.hasMany(db.LeadCounsellor, { foreignKey: 'lead_id' });
db.Counsellor.hasMany(db.LeadCounsellor, { foreignKey: 'counsellor_id' });

db.LeadGroup.hasMany(db.LeadGroupMapping, {
    foreignKey: 'group_id',
    as: 'LeadGroupMappings'
});

db.LeadGroupMapping.belongsTo(db.Lead, { foreignKey: 'lead_id', as: 'Lead' });

db.LeadGroup.belongsTo(db.Counsellor, { foreignKey: 'created_by', as: 'Creator' });



// Sync the models with the database (optional if needed)
// sequelize.sync({ force: false }).then(() => {
//     console.log('Database & tables synced.');
// });

 
    db.Lead.hasMany(db.LeadMessageHistory, {
        foreignKey: 'lead_id', // This is the foreign key in LeadMessageHistory model
        as: 'messageHistory', // Alias for accessing related message history
    });

    db.LeadMessageHistory.belongsTo(db.Lead, {
        foreignKey: 'lead_id', // This is the foreign key in LeadMessageHistory model
        as: 'leads', // Alias for accessing the related Lead
    });

// Export db object
module.exports = db;

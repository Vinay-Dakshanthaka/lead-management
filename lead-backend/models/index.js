const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    // operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

// Create database if it doesn't exist
sequelize.query("CREATE DATABASE IF NOT EXISTS testDB", (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database created successfully ", results);
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
// db.User = require('./userModel.js')(sequelize, DataTypes);
db.Lead = require('./leadModel.js')(sequelize,DataTypes);

// Export db object
module.exports = db;
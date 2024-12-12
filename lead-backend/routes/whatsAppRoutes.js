const express = require('express');
const whatsAppRoutes = express.Router();

const whatsAppController = require('../controller/whatsAppController');

whatsAppRoutes.post('/create-template', whatsAppController.createWhatsAppTemplate);


module.exports = whatsAppRoutes;
const express = require('express')
const interestedLeadsWhatsAppRoute = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const authenticateToken  = require('../middlewares/authenticateToken')

const interestedLeadsWhatsAppController = require('../controller/interestedLeadsWhatsAppController')

interestedLeadsWhatsAppRoute.post('/interested-leads', interestedLeadsWhatsAppController.saveInterestedLeadData);

module.exports = interestedLeadsWhatsAppRoute;
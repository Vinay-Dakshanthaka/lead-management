const express = require('express')
const whatsappLeadRoutes = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const authenticateToken  = require('../middlewares/authenticateToken')

const whatsappLeadController = require('../controller/whatsappLeadController');

whatsappLeadRoutes.post('/saveWhatsAppLeadData', whatsappLeadController.saveWhatsAppLeadData);

whatsappLeadRoutes.get('/getAllWhatsAppLeads', authenticateToken, whatsappLeadController.getAllWhatsAppLeads);

module.exports = whatsappLeadRoutes
const express = require('express')
const leadRoutes = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Save uploaded excel files in the 'uploads' directory
const authenticateToken  = require('../middlewares/authenticateToken')

const leadController = require('../controller/leadController');

leadRoutes.post('/save-lead-data', leadController.saveLeadData);

leadRoutes.post('/reAssignLead', leadController.reAssignLead);

leadRoutes.put('/updateLeadDetails',authenticateToken, leadController.updateLeadDetails);

leadRoutes.post('/upload-leads', upload.single('file'), authenticateToken, leadController.uploadLeadData);

leadRoutes.get('/get-lead-data', authenticateToken, leadController.getLeadData);

leadRoutes.post('/getLeadDetails', authenticateToken, leadController.getLeadDetails);

leadRoutes.get('/get-lead-data-by-id/:lead_id', leadController.getLeadDataById);

// leadRoutes.post('/update-lead-data/:lead_id', leadController.updateLeadData);

leadRoutes.get('/joined-leads', leadController.getJoinedLeadData);

module.exports = leadRoutes;
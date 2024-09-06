const express = require('express')
const leadRoutes = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Save uploaded excel files in the 'uploads' directory


const leadController = require('../controller/leadController');

leadRoutes.post('/save-lead-data', leadController.saveLeadData);

leadRoutes.post('/upload-leads', upload.single('file'), leadController.uploadLeadData);

leadRoutes.get('/get-lead-data', leadController.getLeadData);

leadRoutes.get('/get-lead-data-by-id/:lead_id', leadController.getLeadDataById);

leadRoutes.post('/update-lead-data/:lead_id', leadController.updateLeadData);

leadRoutes.get('/joined-leads', leadController.getJoinedLeadData);

module.exports = leadRoutes;
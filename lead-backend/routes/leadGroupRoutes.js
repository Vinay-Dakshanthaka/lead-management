const express = require('express')
const leadGroupRoutes = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const authenticateToken  = require('../middlewares/authenticateToken')

const leadGroupController = require('../controller/leadGroupController')

leadGroupRoutes.post('/createLeadGroup', authenticateToken, leadGroupController.createLeadGroup);

leadGroupRoutes.get('/getLeadsByGroup', leadGroupController.getLeadsByGroup);

leadGroupRoutes.post('/assignLeadsToGroup', leadGroupController.assignLeadsToGroup);

leadGroupRoutes.put('/updateLeadGroup', leadGroupController.updateLeadGroup);

leadGroupRoutes.delete('/deleteLeadGroup', leadGroupController.deleteLeadGroup);

leadGroupRoutes.get('/getAllLeadGroups', authenticateToken,  leadGroupController.getAllLeadGroups);

leadGroupRoutes.get('/getLeadGroupsByCreator', authenticateToken,  leadGroupController.getLeadGroupsByCreator);


module.exports = leadGroupRoutes;
const express = require('express');
const counsellorController = require('../controller/councellorController');
const counsellorRouter = express.Router();
const authenticateToken  = require('../middlewares/authenticateToken')

counsellorRouter.get('/getAllLeadsForCounsellorById',authenticateToken, counsellorController.getAllLeadsForCounsellorById);

counsellorRouter.get('/getCounsellorDetailsById',authenticateToken, counsellorController.getCounsellorDetailsById);

counsellorRouter.put('/updateCounsellorDetailsById',authenticateToken, counsellorController.updateCounsellorDetailsById);

module.exports = counsellorRouter;
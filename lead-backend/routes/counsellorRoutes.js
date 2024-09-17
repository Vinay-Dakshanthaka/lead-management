const express = require('express');
const counsellorController = require('../controller/councellorController');
const counsellorRouter = express.Router();
const authenticateToken  = require('../middlewares/authenticateToken')

counsellorRouter.get('/getAllLeadsForCounsellorById',authenticateToken, counsellorController.getAllLeadsForCounsellorById);

module.exports = counsellorRouter;
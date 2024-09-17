const express = require('express');
const adminController = require('../controller/adminController');
const adminRouter = express.Router();
const authenticateToken  = require('../middlewares/authenticateToken')

adminRouter.get('/get-all-counsellors',authenticateToken, adminController.getAllCounsellors);

adminRouter.post('/get-leads-by-counsellor', adminController.getAllLeadsForCounsellor);

adminRouter.get('/getAllLeadsAndCounsellors', adminController.getAllLeadsAndCounsellors);

adminRouter.get('/dashboard-overview', adminController.getDashboardOverview);

module.exports = adminRouter;
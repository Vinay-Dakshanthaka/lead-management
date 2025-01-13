const express = require('express');
const adminController = require('../controller/adminController');
const adminRouter = express.Router();
const authenticateToken  = require('../middlewares/authenticateToken')

adminRouter.get('/get-all-counsellors',authenticateToken, adminController.getAllCounsellors);

adminRouter.post('/get-leads-by-counsellor', adminController.getAllLeadsForCounsellor);

adminRouter.get('/getAllLeadsAndCounsellors', authenticateToken, adminController.getAllLeadsAndCounsellors);

adminRouter.get('/dashboard-overview', authenticateToken, adminController.getDashboardOverview);

adminRouter.post('/adminConfig/saveAdminConfig', authenticateToken, adminController.saveAdminConfig);

adminRouter.get('/super-admin/admin-details', authenticateToken, adminController.getAllAdmin);

module.exports = adminRouter;
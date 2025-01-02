const express = require('express');
const leadMessageHistoryController = require('../controller/leadMessageHistoryController');
const leadMessageHistoryRouter = express.Router();


leadMessageHistoryRouter.post('/createLeadMessageHistory',leadMessageHistoryController.createLeadMessageHistory);
leadMessageHistoryRouter.get('/count/:template_name/:lead_id',leadMessageHistoryController.getMessageCountByTemplateName);


module.exports = leadMessageHistoryRouter;
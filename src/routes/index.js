const express = require('express');
const router = express.Router();


const assistantRoutes = require('./assistant.routes');
const phoneNumberRoutes = require('./phone-number.routes');
const clientRoutes = require('./clients.routes');
const servicesRoutes = require('./services.routes');
const mailRoutes = require('./mail.routes');
const scheduleRoutes = require('./schedule.routes');
const auth = require('./auth.routes');
const announcementRoutes = require('./announcement.routes');
const googleSheets = require('./googleSheet.routes');
const {isValidateName}  = require('../services/name-validator.service');


router.use('/assistant', assistantRoutes);
router.use('/phone', phoneNumberRoutes);
router.use('/clients', clientRoutes);
router.use('/services', servicesRoutes);
router.use('/mail', mailRoutes);
router.use('/announcement', announcementRoutes);
router.use('/event-schedule', scheduleRoutes);
router.use('/auth', auth);
router.use('/spreadsheet', googleSheets);
router.use('/validatorName', isValidateName);

module.exports = router;

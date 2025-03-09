const express = require('express');
const router = express.Router();


const assistantRoutes = require('./assistant.routes');
const phoneNumberRoutes = require('./phone-number.routes');
const clientRoutes = require('./clients.routes');
const servicesRoutes = require('./services.routes');
const mailRoutes = require('./mail.routes');


router.use('/assistant', assistantRoutes);
router.use('/phone', phoneNumberRoutes);
router.use('/clients', clientRoutes);
router.use('/services', servicesRoutes);
router.use('/mail', mailRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();


const assistantRoutes = require('./assistant.routes');
const phoneNumberRoutes = require('./phone-number.routes');
const dbRoutes = require('./client.routes');
const mailRoutes = require('./mail.routes');


router.use('/assistant', assistantRoutes);
router.use('/phone', phoneNumberRoutes);
router.use('/supabase', dbRoutes);
router.use('/mail', mailRoutes);

module.exports = router;

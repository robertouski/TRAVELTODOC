const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/services.controller');

// Supabase-services Routes
router.get('/', ServicesController.getServices);



module.exports = router;  
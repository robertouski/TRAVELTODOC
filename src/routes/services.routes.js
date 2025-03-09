const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/services.controller');

// Supabase-services Routes
router.get('/', ServicesController.getServices);
router.get('/:id', ServicesController.getServiceById);
router.post('/', ServicesController.createService);


module.exports = router;  
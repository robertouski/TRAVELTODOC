const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/schedule.controller');

router.post('/', calendarController.createEvent);

module.exports = router;
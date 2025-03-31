const express = require('express');
const router = express.Router();
const { upsertSheetData } = require('../controllers/spreadSheet.controller');
router.post('/', upsertSheetData);

module.exports = router;
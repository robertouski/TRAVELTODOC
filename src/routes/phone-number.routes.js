const express = require('express');
const router = express.Router();
const getPhoneNumberCountry  = require('../controllers/phone-number.controller');

router.post('/', getPhoneNumberCountry);

module.exports = router;
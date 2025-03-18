// En tu archivo de rutas (routes.js)
const express = require('express');
const router = express.Router();
const  {getAuthUrl}  = require('../controllers/auth.controller');

router.get('/', getAuthUrl);

module.exports = router;
const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/client.controller');


// Supabase-Clientes Routes
router.post('/clients', ClientController.createClient);
router.get('/clients/:phone', ClientController.getClient);
router.post('/clients/:phone/messages', ClientController.addMessage);
router.put('/clients/:phone/surgery', ClientController.updateSurgery);
router.post('/clients/:phone/transfer-agent', ClientController.transferAgent);





module.exports = router;
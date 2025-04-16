const express = require('express');
const router = express.Router();
const AssistantController = require('../controllers/assistant.controller');

router.post('/findAssistant', AssistantController.findAssistant);
router.post('/', AssistantController.createAssistant);
router.delete('/', AssistantController.deleteAssistant);

module.exports = router;

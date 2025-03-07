const express = require('express');
const router = express.Router();
const AssistantController = require('../controllers/assistant.controller');

router.post('/', AssistantController.findOrCreateAssistant);
router.get('/:assistantId', AssistantController.getAssistantInfo);

module.exports = router;

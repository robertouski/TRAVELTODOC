const express = require('express');
const router = express.Router();
const AnnouncementController = require('../controllers/announcement.controller');
// Supabase-announcement Routes
router.get('/', AnnouncementController.getAnnouncement);



module.exports = router;  
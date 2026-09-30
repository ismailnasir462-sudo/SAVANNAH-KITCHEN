const express = require('express');
const router = express.Router();
const { sendBulkAnnouncement } = require('../controllers/adminController');

// POST /api/admin/announcement/send
router.post('/announcement/send', sendBulkAnnouncement);

module.exports = router;
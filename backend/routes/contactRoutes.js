const express = require('express');
const router = express.Router();
const { 
  submitMessage, 
  getAllMessages, 
  replyToMessage 
} = require('../controllers/contactController');

router.post('/', submitMessage);
router.get('/', getAllMessages);
router.post('/reply', replyToMessage);

module.exports = router;
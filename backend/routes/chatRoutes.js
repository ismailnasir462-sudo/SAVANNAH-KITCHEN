const express = require('express');
const router = express.Router();
const { sendMessage, getUserChatHistory, getAdminChatList } = require('../controllers/chatController');

router.post('/send', sendMessage);
router.get('/user/:user_id', getUserChatHistory);
router.get('/admin/list', getAdminChatList);

module.exports = router;
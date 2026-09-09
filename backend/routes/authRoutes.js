const express = require('express');
const router = express.Router();
const { signup, login, googleAuth, facebookAuth } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-auth', googleAuth);
router.post('/facebook-auth', facebookAuth);

module.exports = router;
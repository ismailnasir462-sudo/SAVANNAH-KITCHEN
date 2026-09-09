const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- 1. Standard Signup ---
exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, username, email, phone, address, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Check existing user
    const [existing] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email or username already exists.' });
    }

    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, username, email, phone, address, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, username, email, phone, address, password]
    );

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// --- 2. Standard Login ---
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    const [rows] = await db.query(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?',
      [identifier, identifier, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// --- 3. Google Social Auth ---
exports.googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    // Check if user exists in database
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = rows[0];

    if (!user) {
      // Auto-generate a unique username from email prefix or fallback
      const generatedUsername = email ? email.split('@')[0] : `user_${Date.now()}`;

      // Auto-register new social user with generated username
      const [result] = await db.query(
        'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
        [given_name || 'Google', family_name || 'User', generatedUsername, email, 'SOCIAL_AUTH_USER']
      );
      
      user = { id: result.insertId, first_name: given_name, last_name: family_name, username: generatedUsername, email };
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(500).json({ success: false, message: 'Google authentication failed.' });
  }
};

// --- 4. Facebook Social Auth ---
exports.facebookAuth = async (req, res) => {
  const { accessToken, userID } = req.body;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${userID}?fields=first_name,last_name,email&access_token=${accessToken}`
    );
    const { email, first_name, last_name } = response.data;

    const userEmail = email || `${userID}@facebook.com`;

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [userEmail]);
    let user = rows[0];

    if (!user) {
      // Auto-generate a unique username from email prefix or user ID
      const generatedUsername = userEmail ? userEmail.split('@')[0] : `fb_${userID}`;

      const [result] = await db.query(
        'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
        [first_name || 'Facebook', last_name || 'User', generatedUsername, userEmail, 'SOCIAL_AUTH_USER']
      );
      
      user = { id: result.insertId, first_name, last_name, username: generatedUsername, email: userEmail };
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Facebook Auth Error:', error);
    return res.status(500).json({ success: false, message: 'Facebook authentication failed.' });
  }
};
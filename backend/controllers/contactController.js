const db = require('../config/db');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (Port 465 Direct SSL)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

// Submit new contact message from customer
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, text } = req.body;

    if (!name || !email || !phone || !text) {
      return res.status(400).json({ error: 'Please fill out all required fields.' });
    }

    const [result] = await db.query(
      `INSERT INTO messages (name, email, phone, subject, text) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, subject || 'General Inquiry', text]
    );

    res.status(201).json({
      message: 'Message sent successfully!',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Submit Message Error:', error);
    res.status(500).json({ error: 'Database server error.' });
  }
};

// Get all messages for Admin
exports.getAllMessages = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM messages ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    console.error('Fetch Messages Error:', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

// Reply to a customer message via Nodemailer
exports.replyToMessage = async (req, res) => {
  const { to, subject, message, originalMessage, messageId } = req.body;

  if (!to || !message) {
    return res.status(400).json({ success: false, message: 'Recipient email and message body are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"Savannah Kitchen" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Re: ${subject || 'Savannah Kitchen Inquiry'}`,
      text: `${message}\n\n--- Original Message ---\n${originalMessage || ''}`
    });

    if (messageId) {
      await db.query(`UPDATE messages SET status = 'Replied' WHERE id = ?`, [messageId]);
    }

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Check credentials.' });
  }
};
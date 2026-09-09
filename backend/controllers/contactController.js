const db = require('../config/db');
const nodemailer = require('nodemailer');

// Configure email transporter using explicit host/port settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS on port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// Verify SMTP connection on server startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer SMTP Connection Error:', error);
  } else {
    console.log('Nodemailer SMTP server is ready to send messages!');
  }
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
    const mailOptions = {
      from: `"Savannah Kitchen" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Re: ${subject || 'Savannah Kitchen Inquiry'}`,
      text: `${message}\n\n--- Original Message ---\n${originalMessage || ''}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    
    // Update message status in database if applicable
    if (messageId) {
      await db.query(`UPDATE messages SET status = 'Replied' WHERE id = ?`, [messageId]);
    }

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Check credentials.' });
  }
};
const nodemailer = require('nodemailer');
const db = require('../config/db');

// Transporter configuration for Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 15000,
  socketTimeout: 15000
});
// POST /api/admin/announcement/send
const sendBulkAnnouncement = async (req, res) => {
  const { title, type, subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ success: false, message: 'Subject and message are required.' });
  }

  try {
    // 1. Fetch unique emails across all database sources
    const [users] = await db.query('SELECT DISTINCT email FROM users WHERE email IS NOT NULL AND email != ""');
    const [orders] = await db.query('SELECT DISTINCT email FROM orders WHERE email IS NOT NULL AND email != ""');
    const [reservations] = await db.query('SELECT DISTINCT email FROM reservations WHERE email IS NOT NULL AND email != ""');
    const [messages] = await db.query('SELECT DISTINCT email FROM messages WHERE email IS NOT NULL AND email != ""');

    // 2. Deduplicate emails
    const allEmails = new Set([
      ...users.map(u => u.email),
      ...orders.map(o => o.email),
      ...reservations.map(r => r.email),
      ...messages.map(m => m.email)
    ]);

    const recipientList = Array.from(allEmails);

    if (recipientList.length === 0) {
      return res.status(404).json({ success: false, message: 'No customer emails found in database.' });
    }

    // 3. Define category badges
    let badgeColor = '#C79A44';
    let badgeLabel = 'ANNOUNCEMENT';

    if (type === 'urgent') {
      badgeColor = '#dc2626';
      badgeLabel = 'URGENT NOTICE';
    } else if (type === 'offer') {
      badgeColor = '#16a34a';
      badgeLabel = 'SPECIAL OFFER';
    }

    // 4. Build HTML email layout
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #12100e; color: #ffffff; padding: 30px; border-radius: 16px;">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #C79A44; margin: 0; font-size: 24px;">Savannah Kitchen</h1>
        </div>

        <div style="margin-bottom: 20px;">
          <span style="background-color: ${badgeColor}; color: #ffffff; font-size: 11px; font-weight: bold; padding: 6px 14px; border-radius: 20px; text-transform: uppercase;">
            ${badgeLabel}
          </span>
        </div>

        <h2 style="font-size: 20px; margin-top: 10px; color: #ffffff;">${title || subject}</h2>
        <div style="font-size: 14px; line-height: 1.6; color: #e7e5e4; white-space: pre-line; margin-top: 15px;">
          ${message}
        </div>
      </div>
    `;

    // 5. Send bulk email using BCC
    await transporter.sendMail({
      from: `"Savannah Kitchen" <${process.env.GMAIL_USER}>`,
      bcc: recipientList,
      subject: `[${badgeLabel}] ${subject}`,
      html: emailHtml
    });

    return res.json({ success: true, message: `Broadcasted to ${recipientList.length} customers!` });
  } catch (error) {
    console.error('Announcement Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send bulk email.' });
  }
};

module.exports = {
  sendBulkAnnouncement
};
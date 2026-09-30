const db = require('../config/db');

// Send message (User or Admin)
exports.sendMessage = async (req, res) => {
  try {
    const { user_id, user_name, user_email, sender_type, message } = req.body;

    if (!user_id || !sender_type || !message) {
      return res.status(400).json({ success: false, message: 'user_id, sender_type, and message are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO chat_messages (user_id, user_name, user_email, sender_type, message, is_read) 
       VALUES (?, ?, ?, ?, ?, 0)`,
      [
        String(user_id), 
        sender_type === 'user' ? (user_name || 'Customer') : null, 
        user_email || 'No email', 
        sender_type, 
        message
      ]
    );

    res.status(201).json({
      success: true,
      messageId: result.insertId,
      user_id: String(user_id),
      sender_type,
      message
    });
  } catch (error) {
    console.error('Send Chat Message Error:', error);
    res.status(500).json({ success: false, message: 'Server error sending message.' });
  }
};

// Get chat history for a specific user & mark admin replies as READ
exports.getUserChatHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { markRead } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    if (markRead === 'true') {
      await db.query(
        `UPDATE chat_messages SET is_read = 1 WHERE user_id = ? AND sender_type = 'admin' AND is_read = 0`,
        [String(user_id)]
      );
    }

    const [rows] = await db.query(
      `SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC`,
      [String(user_id)]
    );

    res.json({ success: true, messages: rows });
  } catch (error) {
    console.error('Fetch User Chat Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching chat history.' });
  }
};

// Get active chat list grouped by user (Admin View) & mark customer messages as READ
exports.getAdminChatList = async (req, res) => {
  try {
    const { active_user_id } = req.query;

    // Mark user messages as read when admin selects customer or polls active chat
    if (active_user_id) {
      await db.query(
        `UPDATE chat_messages SET is_read = 1 WHERE user_id = ? AND sender_type = 'user' AND is_read = 0`,
        [String(active_user_id)]
      );
    }

    const [rows] = await db.query(`
      SELECT 
        cm.user_id,
        COALESCE(MAX(u.first_name), MAX(cm.user_name), CONCAT('Customer #', cm.user_id)) AS user_name,
        COALESCE(MAX(u.email), MAX(cm.user_email), 'No email provided') AS user_email,
        (
          SELECT message 
          FROM chat_messages 
          WHERE user_id = cm.user_id 
          ORDER BY created_at DESC, id DESC 
          LIMIT 1
        ) AS last_message,
        (
          SELECT created_at 
          FROM chat_messages 
          WHERE user_id = cm.user_id 
          ORDER BY created_at DESC, id DESC 
          LIMIT 1
        ) AS last_time,
        (
          SELECT COUNT(*) 
          FROM chat_messages 
          WHERE user_id = cm.user_id AND sender_type = 'user' AND is_read = 0
        ) AS unread_count
      FROM chat_messages cm
      LEFT JOIN users u ON cm.user_id = u.id
      GROUP BY cm.user_id
      ORDER BY last_time DESC
    `);

    const [unreadRows] = await db.query(
      `SELECT COUNT(*) as total_unread FROM chat_messages WHERE sender_type = 'user' AND is_read = 0`
    );

    res.json({ success: true, chats: rows, total_unread: unreadRows[0]?.total_unread || 0 });
  } catch (error) {
    console.error('Fetch Admin Chat List Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching admin chats.' });
  }
};
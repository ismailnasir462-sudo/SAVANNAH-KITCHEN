const db = require('../config/db');

// POST /api/orders - Submit a new food order
const createOrder = async (req, res) => {
  const { user_id, customer, email, phone, address, items, total, payment_method, payment_reference } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO orders (user_id, customer, email, phone, address, items, total, payment_method, payment_reference, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [user_id || null, customer, email, phone, address, items, total, payment_method, payment_reference || 'CASH_ON_DELIVERY']
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderId: result.insertId // Refers to the auto-increment primary key 'id'
    });
  } catch (error) {
    console.error('DATABASE INSERT ERROR:', error.sqlMessage || error);
    return res.status(500).json({ 
      success: false, 
      message: error.sqlMessage || 'Server error creating order.' 
    });
  }
};

// GET /api/orders - Fetch all orders
const getOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM orders ORDER BY created_at DESC`);
    return res.status(200).json({ success: true, orders: rows });
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

// PUT /api/orders/:id - Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const [result] = await db.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({ success: true, message: 'Order status updated successfully!' });
  } catch (error) {
    console.error('Update Order Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
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

// Helper function to send delivery confirmation email
const sendOrderDeliveredEmail = async (order) => {
  const customerName = order.customer || order.customer_name || 'Valued Guest';
  const totalAmount = Number(order.total || order.total_amount || 0).toFixed(2);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #12100e; color: #ffffff; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="color: #C79A44; font-family: Georgia, serif; margin: 0;">Savannah Kitchen</h1>
        <p style="font-size: 12px; color: #a8a29e; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Order Delivered Confirmation</p>
      </div>

      <p style="font-size: 16px; margin-bottom: 12px;">Hello <strong>${customerName}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #e7e5e4;">
        Your order has been successfully delivered! Thank you for choosing Savannah Kitchen. We hope you enjoy your meal!
      </p>

      <div style="background-color: #1a1714; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin: 20px 0;">
        <h3 style="color: #C79A44; margin-top: 0; font-size: 14px; text-transform: uppercase;">Delivery Details</h3>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Order ID:</strong> ORD-${order.id}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Items:</strong> ${order.items}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Delivery Address:</strong> ${order.address || 'Pick-up / Direct Handout'}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Total Paid:</strong> ₵${totalAmount}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Payment Method:</strong> ${order.payment_method || 'Cash on Delivery'}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">DELIVERED</span></p>
      </div>

      <p style="font-size: 12px; color: #78716c; text-align: center; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
        Savannah Kitchen • Fine Dining & Fast Delivery<br/>
        We look forward to serving you again soon!
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Savannah Kitchen" <${process.env.EMAIL_USER}>`,
    to: order.email || order.customer_email,
    subject: `Order Delivered! - Savannah Kitchen (ORD-${order.id})`,
    html: htmlContent,
  });
};

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
      orderId: result.insertId
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

// PUT /api/orders/:id/status - Update order status & send email if delivered
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = rows[0];

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    const recipientEmail = order.email || order.customer_email;
    if (status.toLowerCase() === 'delivered' && recipientEmail) {
      try {
        await sendOrderDeliveredEmail(order);
        console.log(`Delivery confirmation email sent to ${recipientEmail} (ORD-${id})`);
      } catch (emailError) {
        console.error('Failed to send order delivery email:', emailError);
      }
    }

    return res.status(200).json({ success: true, message: `Order status updated to ${status}!` });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
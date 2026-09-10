const db = require('../config/db');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (using STARTTLS Port 587)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  }
});

// Helper function to generate and send custom status emails
const sendReservationStatusEmail = async (reservation, newStatus) => {
  let statusMessage = '';
  let statusColor = '#C79A44'; // Gold accent

  switch (newStatus.toLowerCase()) {
    case 'confirmed':
      statusColor = '#22c55e'; // Green
      statusMessage = `We are delighted to confirm your table reservation at Savannah Kitchen! Your table will be ready for you at your requested time.`;
      break;
    case 'completed':
      statusColor = '#3b82f6'; // Blue
      statusMessage = `Thank you for dining with us at Savannah Kitchen! We hope you enjoyed your meal and look forward to welcoming you back soon.`;
      break;
    case 'cancelled':
      statusColor = '#ef4444'; // Red
      statusMessage = `Your reservation has been cancelled. If you believe this was done in error or wish to reschedule, please feel free to reach out to us directly.`;
      break;
    default:
      statusMessage = `Your reservation status has been updated to: ${newStatus}.`;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #12100e; color: #ffffff; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="color: #C79A44; font-family: Georgia, serif; margin: 0;">Savannah Kitchen</h1>
        <p style="font-size: 12px; color: #a8a29e; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Table Reservation Update</p>
      </div>

      <p style="font-size: 16px; margin-bottom: 12px;">Hello <strong>${reservation.name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #e7e5e4;">${statusMessage}</p>

      <div style="background-color: #1a1714; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin: 20px 0;">
        <h3 style="color: #C79A44; margin-top: 0; font-size: 14px; text-transform: uppercase;">Booking Details</h3>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Reservation ID:</strong> RES-${reservation.id}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Date:</strong> ${reservation.res_date}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Time:</strong> ${reservation.res_time}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Guests:</strong> ${reservation.guests} Guests</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Seating:</strong> ${reservation.seating || 'Indoor'}</p>
        <p style="margin: 6px 0; font-size: 13px;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
      </div>

      <p style="font-size: 12px; color: #78716c; text-align: center; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
        Savannah Kitchen • Fine Dining Experience<br/>
        For immediate changes, please contact us via our website.
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Savannah Kitchen" <${process.env.EMAIL_USER}>`,
    to: reservation.email,
    subject: `Reservation ${newStatus.toUpperCase()} - Savannah Kitchen (RES-${reservation.id})`,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

// POST /api/reservations - Create a new booking
exports.createReservation = async (req, res) => {
  try {
    const { name, email, phone, guests, res_date, res_time, seating, special_request } = req.body;

    if (!name || !email || !phone || !guests || !res_date || !res_time) {
      return res.status(400).json({ error: 'Please provide all required reservation details.' });
    }

    const [result] = await db.query(
      `INSERT INTO reservations (name, email, phone, guests, res_date, res_time, seating, special_request) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, guests, res_date, res_time, seating || 'Indoor', special_request || null]
    );

    res.status(201).json({
      message: 'Reservation booked successfully!',
      reservationId: result.insertId
    });
  } catch (error) {
    console.error('Create Reservation Error:', error);
    res.status(500).json({ error: 'Failed to create reservation.' });
  }
};

// GET /api/reservations - Fetch all reservations (Admin view)
exports.getAllReservations = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM reservations ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    console.error('Fetch Reservations Error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations.' });
  }
};

// PUT /api/reservations/:id/status - Update reservation status & send email
exports.updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  try {
    // Fetch reservation details from the database
    const [rows] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const reservation = rows[0];

    // Update status in MySQL database
    await db.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);

    // Send email notification to customer
    if (reservation.email) {
      try {
        await sendReservationStatusEmail(reservation, status);
        console.log(`Reservation status email sent to ${reservation.email} (${status})`);
      } catch (emailError) {
        console.error('Failed to send reservation email:', emailError);
      }
    }

    res.status(200).json({ success: true, message: `Reservation status updated to ${status}!` });
  } catch (error) {
    console.error('Update Reservation Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update reservation status.' });
  }
};
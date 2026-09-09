const db = require('../config/db');

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

// PUT /api/reservations/:id - Update reservation status (Pending, Confirmed, Completed, Cancelled)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const [result] = await db.query(
      `UPDATE reservations SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    res.json({ message: 'Reservation status updated successfully!' });
  } catch (error) {
    console.error('Update Reservation Error:', error);
    res.status(500).json({ error: 'Failed to update reservation.' });
  }
};
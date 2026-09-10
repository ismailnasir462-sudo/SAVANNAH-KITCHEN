const express = require('express');
const router = express.Router();
const { 
  createReservation, 
  getAllReservations, 
  updateReservationStatus 
} = require('../controllers/reservationController');

// Booking endpoints
router.post('/', createReservation);
router.get('/', getAllReservations);

// Update status endpoint (Handles both /:id and /:id/status to prevent 404s)
router.put('/:id/status', updateReservationStatus);
router.put('/:id', updateReservationStatus);

module.exports = router;
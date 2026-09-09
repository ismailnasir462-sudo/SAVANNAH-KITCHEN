const express = require('express');
const router = express.Router();
const { 
  createReservation, 
  getAllReservations, 
  updateReservationStatus 
} = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/', getAllReservations);
router.put('/:id', updateReservationStatus);

module.exports = router;
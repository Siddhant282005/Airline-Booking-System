const express = require('express');
const { SeatController } = require('../../controllers');

const router = express.Router();

// GET /api/v1/seats/flight/:flightId - Get all seats for a flight
router.get('/flight/:flightId', SeatController.getSeatsForFlight);

// GET /api/v1/seats/flight/:flightId/available - Get available seats for a flight
router.get('/flight/:flightId/available', SeatController.getAvailableSeatsForFlight);

// POST /api/v1/seats/book - Book specific seats
router.post('/book', SeatController.bookSeats);

// POST /api/v1/seats/unbook - Unbook specific seats
router.post('/unbook', SeatController.unbookSeats);

module.exports = router;

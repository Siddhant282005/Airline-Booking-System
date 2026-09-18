
const express = require('express');
const { BookingController } = require('../../controllers');
const { validateCreateBooking, validateMakePayment } = require('../../middlewares/booking-middleware');

const router = express.Router();

// POST /api/v1/bookings - Create a booking
router.post('/', validateCreateBooking, BookingController.createBooking);

// GET /api/v1/bookings/user/:userId - List bookings for a user
router.get('/user/:userId', BookingController.getUserBookings);

// Support both singular and plural endpoint names for payments
router.post('/payment', validateMakePayment, BookingController.makePayment);
router.post('/payments', validateMakePayment, BookingController.makePayment);

// PATCH /api/v1/bookings/:id/cancel - Cancel a specific booking (user must own it)
router.patch('/:id/cancel', BookingController.cancelUserBooking);

module.exports = router;
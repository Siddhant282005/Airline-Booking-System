const express = require('express');

const router = express.Router();
const { InfoController } = require('../../controllers');
const bookingRoutes = require('./booking');

// Info route
router.get('/info', InfoController.info);

// Mount booking routes under /bookings
router.use('/bookings', bookingRoutes);

module.exports = router;
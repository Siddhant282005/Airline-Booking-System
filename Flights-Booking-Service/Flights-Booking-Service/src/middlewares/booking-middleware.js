// Middleware to validate booking creation request
function validateCreateBooking(req, res, next) {
    const { flightId, userId, noOfSeats } = req.body;
    if (!flightId || !userId || !noOfSeats) {
        return res.status(400).json({
            success: false,
            message: 'flightId, userId, and noOfSeats are required.'
        });
    }
    if (isNaN(Number(flightId)) || isNaN(Number(userId)) || isNaN(Number(noOfSeats))) {
        return res.status(400).json({
            success: false,
            message: 'flightId, userId, and noOfSeats must be valid numbers.'
        });
    }
    next();
}

// Middleware to validate payment request
function validateMakePayment(req, res, next) {
    const { bookingId, userId, totalCost } = req.body;
    if (!bookingId || !userId || !totalCost) {
        return res.status(400).json({
            success: false,
            message: 'bookingId, userId, and totalCost are required.'
        });
    }
    if (isNaN(Number(bookingId)) || isNaN(Number(userId)) || isNaN(Number(totalCost))) {
        return res.status(400).json({
            success: false,
            message: 'bookingId, userId, and totalCost must be valid numbers.'
        });
    }
    next();
}

module.exports = {
    validateCreateBooking,
    validateMakePayment
};

const SEAT_TYPE ={
    ECONOMY: 'economy',
    BUSINESS: 'business',
    PREMIUM_ECONOMY: 'premium-economy',
    FIRST_CLASS: 'first-class'
}

const BOOKING_STATUS = {
    BOOKED: 'booked',
    CANCELLED: 'cancelled',
    INITIATED: 'initiated',
    PENDING: 'pending'
}

// Provide both named exports and a top-level Enums object for compatibility.
const Enums = {
    SEAT_TYPE,
    BOOKING_STATUS
}

module.exports = {
    SEAT_TYPE,
    BOOKING_STATUS,
    Enums
}
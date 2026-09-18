const { StatusCodes } = require('http-status-codes');
const { SeatService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

/**
 * GET /api/v1/seats/flight/:flightId
 * Get all seats for a flight
 */
async function getSeatsForFlight(req, res) {
    try {
        const seats = await SeatService.getSeatsForFlight(req.params.flightId);
        SuccessResponse.data = seats;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

/**
 * GET /api/v1/seats/flight/:flightId/available
 * Get available seats for a flight
 */
async function getAvailableSeatsForFlight(req, res) {
    try {
        const seats = await SeatService.getAvailableSeatsForFlight(req.params.flightId);
        SuccessResponse.data = seats;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

/**
 * POST /api/v1/seats/book
 * Book specific seats
 * Request body: { seatIds: [1, 2, 3], flightId: 1 }
 */
async function bookSeats(req, res) {
    try {
        const result = await SeatService.bookSeats(req.body);
        SuccessResponse.data = result;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

/**
 * POST /api/v1/seats/unbook
 * Unbook specific seats
 * Request body: { seatIds: [1, 2, 3] }
 */
async function unbookSeats(req, res) {
    try {
        const result = await SeatService.unbookSeats(req.body.seatIds);
        SuccessResponse.data = result;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

module.exports = {
    getSeatsForFlight,
    getAvailableSeatsForFlight,
    bookSeats,
    unbookSeats
};

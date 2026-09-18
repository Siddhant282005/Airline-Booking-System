const { StatusCodes } = require('http-status-codes');
const { FlightService } = require('../services');
const { SuccessResponse,ErrorResponse } = require('../utils/common');
/**
 * POST :/flights
 * req-body {
 * flightNumber:'UK 808',
 * airplaneId:'AI 202',
 * departureAirportId:'12',
 * arrivalAirportId:'11',
 * arrivalTime:'2023-10-10T10:00:00Z',
 * departureTime:'2023-10-10T07:00:00Z',
 * price: 1000,
 * boardingGate: 'A1',
 * totalSeats: 180
 * }
 */
async function createFlight(req, res) {
    try {
        const flight = await FlightService.createFlight({
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,   
            arrivalTime: req.body.arrivalTime,
            departureTime: req.body.departureTime,
            price: req.body.price,
            boardingGate: req.body.boardingGate,
            totalSeats: req.body.totalSeats
        });
        SuccessResponse.data=flight;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log('Error caught:', error);
        console.log('Error statusCode:', error.statusCode);
        console.log('Error type:', typeof error.statusCode);
        console.log('Error name:', error.name);
        console.log('Error explanation:', error.explanation);
        
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        
        const errorResponse = {
            success: false,
            message: 'Something went wrong',
            data: {},
            error: {
                statusCode: statusCode,
                explanation: error.explanation || error.message || 'Unknown error occurred'
            }
        };
        
        return res.status(statusCode).json(errorResponse);
    }
}

/**
 * GET :/flights
 * req-body {}
 */
async function getFlights(req, res) {
    try {
        const flights = await FlightService.getFlights();
        SuccessResponse.data = flights;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const errorResponse = {
            success: false,
            message: 'Something went wrong',
            data: {},
            error: {
                statusCode: statusCode,
                explanation: error.explanation || error.message || 'Unknown error occurred'
            }
        };
        
        return res.status(statusCode).json(errorResponse);
    }
}

/**
 * GET :/flights/:id
 * req-body {}
 */
async function getFlight(req, res) {
    try {
        const flight = await FlightService.getFlight(req.params.id);
        SuccessResponse.data = flight;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const errorResponse = {
            success: false,
            message: 'Something went wrong',
            data: {},
            error: {
                statusCode: statusCode,
                explanation: error.explanation || error.message || 'Unknown error occurred'
            }
        };
        
        return res.status(statusCode).json(errorResponse);
    }
}

async function getAllFlights(req, res) {
    try {
        const filter = req.query;
        const flights = await FlightService.getAllFlights(filter);
        SuccessResponse.data = flights;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const errorResponse = {
            success: false,
            message: 'Something went wrong',
            data: {},
            error: {
                statusCode: statusCode,
                explanation: error.explanation || error.message || 'Unknown error occurred'
            }
        };
        return res.status(statusCode).json(errorResponse);
    }
}

async function updateSeats(req, res) {
    try {
        const response = await FlightService.updateSeats({
            flightId: req.params.id,
            seats: req.body.seats,
            dec: req.body.dec
        });
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

/**
 * DELETE :/flights/:id
 * req-body {}
 */
async function destroyFlight(req, res) {
    try {
        const response = await FlightService.destroyFlight(req.params.id);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const errorResponse = {
            success: false,
            message: 'Something went wrong',
            data: {},
            error: {
                statusCode: statusCode,
                explanation: error.explanation || error.message || 'Unknown error occurred'
            }
        };
        return res.status(statusCode).json(errorResponse);
    }
}

module.exports = {
    createFlight,
    getFlights,
    getFlight,
    getAllFlights,
    updateSeats,
    destroyFlight
};

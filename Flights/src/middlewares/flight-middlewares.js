const {StatusCodes} = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const {validateFlightTimes} = require('../utils/helpers/datatime-helpers');
function validateCreateRequest(req, res, next) {
    // Check if req.body exists
    if (!req.body) {
        ErrorResponse.message = 'Request body is required';
        ErrorResponse.error = new AppError(['Request body not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    
    if(!req.body.flightNumber) {
        ErrorResponse.message = 'flightNumber is required';
        ErrorResponse.error = new AppError(['flightNumber not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.airplaneId) {
        ErrorResponse.message = 'airplaneId is required';
        ErrorResponse.error = new AppError(['airplaneId not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.departureAirportId) {
        ErrorResponse.message = 'departureAirportId is required';
        ErrorResponse.error = new AppError(['departureAirportId not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.arrivalAirportId) {
        ErrorResponse.message = 'arrivalAirportId is required';
        ErrorResponse.error = new AppError(['arrivalAirportId not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.arrivalTime) {
        ErrorResponse.message = 'arrivalTime is required';
        ErrorResponse.error = new AppError(['arrivalTime not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.departureTime) {
        ErrorResponse.message = 'departureTime is required';
        ErrorResponse.error = new AppError(['departureTime not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.price) {
        ErrorResponse.message = 'price is required';
        ErrorResponse.error = new AppError(['price not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.totalSeats) {
        ErrorResponse.message = 'totalSeats is required';
        ErrorResponse.error = new AppError(['totalSeats not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    
    // Validate that departure time is before arrival time
    if (!validateFlightTimes(req.body.departureTime, req.body.arrivalTime)) {
        ErrorResponse.message = 'Departure time must be before arrival time';
        ErrorResponse.error = new AppError(['Invalid flight times: departure time must be before arrival time'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    
    next();
}

function validateUpdateSeatsRequest(req, res, next) {
    if(!req.body.seats){
        ErrorResponse.message = 'seats is required';
        ErrorResponse.error = new AppError(['seats not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const seatsNum = Number(req.body.seats);
    if(!Number.isFinite(seatsNum) || seatsNum <= 0){
        ErrorResponse.message = 'seats must be a positive number';
        ErrorResponse.error = new AppError(['Invalid seats value in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}
module.exports = {
    validateCreateRequest,
    validateUpdateSeatsRequest
};
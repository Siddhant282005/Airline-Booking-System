const {StatusCodes} = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
function validateCreateRequest(req, res, next) {
    if(!req.body.modelNumber) {
        ErrorResponse.message = 'Model Number is required';
        ErrorResponse.error = new AppError(['Model number not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.capacity) {
        ErrorResponse.message = 'Capacity is required';
        ErrorResponse.error = new AppError(['Capacity not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(isNaN(req.body.capacity) || req.body.capacity < 1) {
        ErrorResponse.message = 'Invalid capacity';
        ErrorResponse.error = new AppError(['Capacity must be a positive number'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateCreateRequest
};
const {StatusCodes} = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
function validateCreateRequest(req, res, next) {
    if(!req.body.name) {
        ErrorResponse.message = 'Name is required';
        ErrorResponse.error = new AppError(['Name not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.code) {
        ErrorResponse.message = 'Code is required';
        ErrorResponse.error = new AppError(['Code not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.cityId) {
        ErrorResponse.message = 'CityId is required';
        ErrorResponse.error = new AppError(['CityId not found in the incoming request'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateCreateRequest
};
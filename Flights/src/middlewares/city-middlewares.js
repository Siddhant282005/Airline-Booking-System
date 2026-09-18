const {StatusCodes} = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
function validateCreateRequest(req, res, next) {
    if(!req.body || !req.body.name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            ...ErrorResponse,
            message: 'City name is required',
            error: new AppError(['City name not found in the incoming request'], StatusCodes.BAD_REQUEST)
        });
    }
    next();
}

module.exports = {
    validateCreateRequest
};
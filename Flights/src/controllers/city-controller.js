const { StatusCodes } = require('http-status-codes');
const { CityService } = require('../services');
const { SuccessResponse,ErrorResponse } = require('../utils/common');


/**
 * POST :/cities
 * req-body {name :'New York'}
 */
async function createCity(req, res) {
    try {
        const city = await CityService.createCity({
            name: req.body.name
        });
        SuccessResponse.data=city;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
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
 * GET :/cities
 * req-body {}
 */
async function getCities(req, res) {
    try {
        const cities = await CityService.getCities();
        SuccessResponse.data = cities;
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
 * GET :/cities/:id
 * req-body {}
 */
async function getCity(req, res) {
    try {
        const city = await CityService.getCity(req.params.id);
        SuccessResponse.data = city;
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
 * DELETE :/cities/:id
 * req-body {}
 */
async function destroyCity(req, res) {
    try {
        const response = await CityService.destroyCity(req.params.id);
        SuccessResponse.data = response;
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
 * PATCH :/cities/:id
 * req-body {name: 'XYZ'}
 */
async function updateCity(req, res) {
    try {
        const city = await CityService.updateCity({
            name: req.body.name
        }, req.params.id);
        SuccessResponse.data = city;
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

module.exports={
    createCity,
    getCities,
    getCity,
    destroyCity,
    updateCity,
}
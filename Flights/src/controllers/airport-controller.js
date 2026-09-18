const { StatusCodes } = require('http-status-codes');
const { AirportService } = require('../services');
const { SuccessResponse,ErrorResponse } = require('../utils/common');
/**
 * POST :/airports
 * req-body {name :'JFK', cityId: 1, code:'JFK', address:'some address'}
 */
async function createAirport(req, res) {
    try {
        const airport = await AirportService.createAirport({
            name: req.body.name,
            code: req.body.code,
            address: req.body.address,
            cityId: req.body.cityId
        });
        SuccessResponse.data=airport;
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

/*
    * GET :/airports
    * req-body {}
*/
async function getAirports(req, res) {
    try {
        const airports = await AirportService.getAirports();
        SuccessResponse.data=airports;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    }catch (error) {
        ErrorResponse.error=error;
        return res
        .status(error.statusCode)
        .json(ErrorResponse);
    }
}


async function getAirport(req, res) {
    try {
        const airport = await AirportService.getAirport(req.params.id);
        SuccessResponse.data=airport;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    }catch (error) {
        ErrorResponse.error=error;
        return res
        .status(error.statusCode)
        .json(ErrorResponse);
    }
}

/*
    * DELETE :/airports/:id
    * req-body {}
*/
async function destroyAirport(req, res) {
    try {
        const response = await AirportService.destroyAirport(req.params.id);
        SuccessResponse.data=response;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    }catch (error) {
        ErrorResponse.error=error;
        return res
        .status(error.statusCode)
        .json(ErrorResponse);
    }
}

/*
    * PATCH :/airports/:id
    * req-body {name: string, code: string, address: string, cityId: number}
*/
async function updateAirport(req, res) {
    try {
        const airport = await AirportService.updateAirport({
            name: req.body.name,
            code: req.body.code,
            address: req.body.address,
            cityId: req.body.cityId
        }, req.params.id);
        SuccessResponse.data = airport;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res
            .status(statusCode)
            .json(ErrorResponse);
    }
}

module.exports = {
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport
};

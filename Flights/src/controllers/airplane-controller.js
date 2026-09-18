const { StatusCodes } = require('http-status-codes');
const { AirplaneService } = require('../services');
const { SuccessResponse,ErrorResponse } = require('../utils/common');
/**
 * POST :/airplanes
 * req-body {modelNumber :'airbus320', capacity:200}
 */
async function createAirplane(req, res) {
    try {
        const airplane = await AirplaneService.createAirplane({
            modelNumber: req.body.modelNumber,
            capacity: req.body.capacity
        });
        SuccessResponse.data=airplane;
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
    * GET :/airplanes
    * req-body {}
*/
async function getAirplanes(req, res) {
    try {
        const airplanes = await AirplaneService.getAirplanes();
        SuccessResponse.data=airplanes;
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

async function getAirplanes(req, res) {
    try {
        const airplanes = await AirplaneService.getAirplanes();
        SuccessResponse.data=airplanes;
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
    * GET :/airplanes/:id
    * req-body {}
*/
async function getAirplane(req, res) {
    try {
        const airplane = await AirplaneService.getAirplane(req.params.id);
        SuccessResponse.data=airplane;
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
    * DELETE :/airplanes/:id
    * req-body {}
*/
async function destroyAirplane(req, res) {
    try {
        const response = await AirplaneService.destroyAirplane(req.params.id);
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
    * PATCH :/airplanes/:id
    * req-body {capacity: number}
*/
async function updateAirplane(req, res) {
    try {
        const airplanes = await AirplaneService.updateAirplane({
            capacity: req.body.capacity
        }, req.params.id);
        SuccessResponse.data = airplanes;
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
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
};

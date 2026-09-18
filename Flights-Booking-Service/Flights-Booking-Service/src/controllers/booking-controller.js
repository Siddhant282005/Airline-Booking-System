const { StatusCodes } = require('http-status-codes');
const {BookingService}=require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');

const inMemDb = {};

async function createBooking(req,res){
    try{
        const response=await BookingService.createBooking({
            flightId:req.body.flightId,
            userId:req.body.userId,
            noOfSeats:req.body.noOfSeats,
            seatIds:req.body.seatIds
        });
        SuccessResponse.data=response;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    }catch(error){
        ErrorResponse.error=error;
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }

}

async function makePayment(req,res){
    try{
        const idempotencyKey=req.headers['x-idempotency-key'];
        if(!idempotencyKey){
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message:"Idempotency key missing in the request"});
        }
        if(inMemDb[idempotencyKey]){
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message:"Idempotency key already used"});
            
        }
        // Coerce incoming values to numbers and validate
        const bookingId = Number(req.body.bookingId);
        const userId = Number(req.body.userId);
        const totalCost = Number(req.body.totalCost);
        const userEmail = req.body.userEmail;

        if(Number.isNaN(bookingId) || Number.isNaN(userId) || Number.isNaN(totalCost)){
            ErrorResponse.error = {
                statusCode: StatusCodes.BAD_REQUEST,
                explanation: 'bookingId, userId and totalCost must be valid numbers'
            };
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }

        const response=await BookingService.makePayment({  
            bookingId,
            userId,
            totalCost,
            userEmail
        });
        SuccessResponse.data=response;
        inMemDb[idempotencyKey]=idempotencyKey; // Mark key as used
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    }catch(error){
        ErrorResponse.error=error;
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

async function getUserBookings(req, res) {
    try {
        const userId = Number(req.params.userId);
        if (Number.isNaN(userId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'userId must be a valid number',
                data: [],
                error: {},
            });
        }

        const response = await BookingService.getUserBookings(userId);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

async function cancelUserBooking(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        // Verify booking belongs to user
        const booking = await BookingService.getUserBookings(userId);
        const userBooking = booking.find(b => b.id === parseInt(id));
        if (!userBooking) {
            return res.status(StatusCodes.FORBIDDEN).json({...ErrorResponse, error: 'Booking not found or does not belong to user'});
        }
        const result = await BookingService.cancelBooking(parseInt(id));
        return res.status(StatusCodes.OK).json({...SuccessResponse, data: result});
    } catch(error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({...ErrorResponse, error});
    }
}

module.exports={
    createBooking,
    makePayment,
    getUserBookings,
    cancelUserBooking
}
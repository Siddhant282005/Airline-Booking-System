const {StatusCodes}=require('http-status-codes');
const AppError=require('../utils/errors/app-error');
const {ErrorResponse}=require('../utils/common');
const { UserService }=require('../services');

function validateAuthRequest(req,res,next){
    if(!req.body.email){
        ErrorResponse.message='Something went wrong while authenticating user';
        ErrorResponse.error=new AppError(['Email not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST);
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse);
    }
    if(!req.body.password){
        ErrorResponse.message='Something went wrong while authenticating user';
        ErrorResponse.error=new AppError(['Password not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST);
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req,res,next){
    try{
        // Check for token in headers first, then query params
        const token = req.headers['x-access-token'] || req.query['x-access-token'];
        
        if(!token){
            throw new AppError(['Missing JWT Token'], StatusCodes.UNAUTHORIZED);
        }
        
        const response=await UserService.isAuthenticated(token);
        if(response){
            req.user=response;//setting user id in req object
            next();
        }
    }catch(error){
        return res.
        status(StatusCodes.UNAUTHORIZED).json({
            message: 'Authentication failed',
            error: error
        });
    }
}
async function isAdmin(req,res,next){
    try{
        const userId=req.user.id;
        const isAdmin=await UserService.isAdmin(userId);
        if(!isAdmin){
            throw new AppError('User is not an admin',StatusCodes.FORBIDDEN);
        }
        next();
    }catch(error){
        return res.
        status(StatusCodes.UNAUTHORIZED).json({
            message: 'Authentication failed',
            error: error
        });
    }
}
module.exports={
    validateAuthRequest,
    checkAuth,
    isAdmin
};
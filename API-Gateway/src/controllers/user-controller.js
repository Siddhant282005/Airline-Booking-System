const {StatusCodes}=require('http-status-codes');
const {UserService}=require('../services');
const AppError=require('../utils/errors/app-error');
const { SuccessResponse,ErrorResponse} = require('../utils/common');




/**
 * POST :/signup
 * req-body : {email,password}
 */

async function signup(req,res,next){
    try{
        const user=await UserService.create({
            email:req.body.email,
            password:req.body.password
        });
        return res
        .status(StatusCodes.CREATED)
        .json({...SuccessResponse, data: user});
    }catch(error){
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({...ErrorResponse, error: error}); 
    }
}

async function signin(req,res,next){
    try{
        const jwt=await UserService.signin({
            email:req.body.email,
            password:req.body.password
        });
        return res
        .status(StatusCodes.OK)
        .json({...SuccessResponse, data: {token: jwt}});
    }catch(error){
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({...ErrorResponse, error: error});
    }    
}
async function addRoleToUser(req,res,next){
    try{
        const user=await UserService.addRoleToUser({
            userId:req.body.userId,
            roleName:req.body.roleName
        });
        return res
        .status(StatusCodes.OK)
        .json({...SuccessResponse, data: user});
    }catch(error){
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({...ErrorResponse, error: error}); 
    }
}
async function getAllUsers(req, res, next) {
    try {
        const users = await UserService.getAllUsers();
        return res.status(StatusCodes.OK).json({...SuccessResponse, data: users});
    } catch(error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({...ErrorResponse, error});
    }
}
module.exports={
    signup,
    signin,
    addRoleToUser,
    getAllUsers
};
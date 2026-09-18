const { StatusCodes } = require('http-status-codes');
const { UserRepository,RoleRepository }= require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Auth,Enums }= require('../utils/common');
const { ENUM } = require('sequelize');
const userRepo= new UserRepository();
const roleRepo= new RoleRepository();

async function create(data){
    try{
        const user= await userRepo.create(data);
        const role= await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
        return user;
    }catch(error){
        if(error.name==='SequelizeUniqueConstraintError' ||error.name==='SequelizeValidationError'){
            let explanation=[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data){
    try{
        //logic for signin will be here
        const user = await userRepo.getUserByEmail(data.email);
        if (!user) {
            throw new AppError('No user found for the given email', StatusCodes.UNAUTHORIZED);
        }
        const passwordMatch = Auth.checkPassword(data.password,user.password);
        if (!passwordMatch) {
            throw new AppError('Incorrect password', StatusCodes.UNAUTHORIZED);
        }
        // Fetch roles so we can embed them in the JWT (Bug 3 fix)
        const roles = await user.getRoles();
        const roleNames = roles.map(r => r.name);
        const isAdmin = roleNames.includes(Enums.USER_ROLES_ENUMS.ADMIN);
        const jwt = Auth.createToken({
            id: user.id,
            email: user.email,
            role: isAdmin ? Enums.USER_ROLES_ENUMS.ADMIN : Enums.USER_ROLES_ENUMS.CUSTOMER
        });
        return jwt;
    }catch(error){
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('Cannot signin user',StatusCodes.INTERNAL_SERVER_ERROR);
    }

}

async function isAuthenticated(token){
    try{
        if(!token){
            throw new AppError('Missing JWT Token',StatusCodes.BAD_REQUEST);
        }
        const response=Auth.verifyToken(token);
        const user= await userRepo.get(response.id);
        if(!user){
            throw new AppError('No user found for the given token',StatusCodes.UNAUTHORIZED);
        }
        // Bug 2 fix: return an object so req.user.id works in isAdmin middleware
        return { id: user.id, email: user.email };
    }catch(error){
        if(error instanceof AppError){
            throw error;
        }
        if(error.name==='JsonWebTokenError'){
            throw new AppError('Invalid JWT Token',StatusCodes.UNAUTHORIZED);
        }
        if(error.name==='TokenExpiredError'){
            throw new AppError('JWT Token has expired',StatusCodes.UNAUTHORIZED);
        }
        throw new AppError('Cannot authenticate user',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoleToUser(data){
    try{
        const user= await userRepo.get(data.userId);
        if(!user){
            throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND);
        }
        const role= await roleRepo.getRoleByName(data.roleName);
        if(!role){
            throw new AppError('No role found for the given name',StatusCodes.NOT_FOUND);
        }
        await user.addRole(role);
        return;
    }catch(error){
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('Cannot add role to user',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function isAdmin(userId){
    try{
        const user=await userRepo.get(userId);
        if(!user){
            throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND);
        }
        const adminRole=await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        if(!adminRole){
            throw new AppError('Admin role not found',StatusCodes.INTERNAL_SERVER_ERROR);
        }
        return user.hasRole(adminRole); 
    }catch(error){
        throw new AppError('Cannot verify admin status',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function getAllUsers(){
    try{
        const users = await userRepo.getAll();
        return users;
    }catch(error){
        throw new AppError('Cannot fetch users', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
module.exports={
    create,
    signin,
    isAuthenticated,
    addRoleToUser,
    isAdmin,
    getAllUsers
};
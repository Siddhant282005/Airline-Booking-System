const {AirportRepository}=require('../repositories');
 
const {StatusCodes}=require('http-status-codes');
const AppError=require('../utils/errors/app-error');
const airportRepository=new AirportRepository();

async function createAirport(data){
    try{
        const airport= await airportRepository.create(data);
        return airport;
    }catch(error){
        console.log('Airport creation error:', error);
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
        
        if(error.name=='SequelizeValidationError'){
            let explanation =[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            const appError = new AppError(explanation.join(', '),StatusCodes.BAD_REQUEST);
            throw appError;
        }
        
        if(error.name=='SequelizeUniqueConstraintError'){
            let explanation =[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            const appError = new AppError(explanation.join(', '),StatusCodes.BAD_REQUEST);
            throw appError;
        }
        
        if(error.name=='SequelizeForeignKeyConstraintError'){
            const appError = new AppError('Invalid cityId provided',StatusCodes.BAD_REQUEST);
            throw appError;
        }
        
        if(error.name=='SequelizeConnectionError' || error.name=='SequelizeDatabaseError'){
            const appError = new AppError('Database connection error',StatusCodes.INTERNAL_SERVER_ERROR);
            throw appError;
        }
        
        const appError = new AppError(`Cannot create a new airport object: ${error.message}`,StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

async function getAirports(){
        try{
            const airports= await airportRepository.getAll();
            return airports;
        }catch(error){
            const appError = new AppError('Cannot fetch data of all airports',StatusCodes.INTERNAL_SERVER_ERROR);
            throw appError; 
        }
}

async function getAirport(id){
        try{
            const airport = await airportRepository.get(id);
            return airport;
        }catch(error){
            if(error.statusCode==StatusCodes.NOT_FOUND){
                throw new AppError('The airport you requested is not present',StatusCodes.NOT_FOUND);
            }
            const appError = new AppError('Cannot fetch airport data',StatusCodes.INTERNAL_SERVER_ERROR);
            throw appError;
        }
}

async function destroyAirport(id){
    try{
            const response = await airportRepository.destroy(id);
            return response;
        }catch(error){
             if(error.statusCode==StatusCodes.NOT_FOUND){
                throw new AppError('The airport you requested  to delete is not present',StatusCodes.NOT_FOUND);
            }
            const appError = new AppError('Cannot delete airport',StatusCodes.INTERNAL_SERVER_ERROR);
            throw appError; 
        }
}

async function updateAirport(data,id)
{
    try{
        const response= await airportRepository.update(id,data);
        return response;
    }
    catch(error){
        if(error.statusCode==StatusCodes.NOT_FOUND)
        {
            throw new AppError('The airport you requested to update is not present ',error.statusCode);
        }
        throw new AppError('Not able to update the airport',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
module.exports={
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport
}
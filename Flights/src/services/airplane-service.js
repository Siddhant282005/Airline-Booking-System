const {AirplaneRepository}=require('../repositories');
 
const {StatusCodes}=require('http-status-codes');
const AppError=require('../utils/errors/app-error');
const airplaneRepository=new AirplaneRepository();

async function createAirplane(data){
    try{
        const airplane= await airplaneRepository.create(data);
        return airplane;
    }catch(error){

        if(error.name=='SequelizeValidationError'){
            let explanation =[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            const appError = new AppError(explanation.join(', '),StatusCodes.BAD_REQUEST);
            throw appError;
        }
        const appError = new AppError('Cannot create a new airplane object',StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

async function getAirplanes(){
        try{
            const airplanes= await airplaneRepository.getAll();
            return airplanes;
        }catch(error){
            const appError = new AppError('Cannot fetch data of all airplanes',StatusCodes.INTERNAL_SERVER_ERROR);
            throw appError; 
        }
}

async function getAirplane(id){
        try{
            const airplane = await airplaneRepository.get(id);
            return airplane;
        }catch(error){
            if(error.statusCode==StatusCodes.NOT_FOUND){
                throw new AppError('The airplane you requested is not present',StatusCodes.NOT_FOUND);
            }
            const appError = new AppError('Cannot fetch airplane data',StatusCodes.INTERNAL_SERVER_ERROR);
            throw appError;
        }
}

async function destroyAirplane(id){
    try{
            const response = await airplaneRepository.destroy(id);
            return response;
        }catch(error){
             if(error.statusCode==StatusCodes.NOT_FOUND){
                throw new AppError('The airplane you requested  to delete is not present',StatusCodes.NOT_FOUND);
            }
            const appError = new AppError('Cannot fetch data of all airplanes',StatusCodes.INTERNAL_SERVER_ERROR);
            throw appError; 
        }
}

async function updateAirplane(data,id)
{
    try{
        const response= await airplaneRepository.update(id,data);
        return response;
    }
    catch(error){
        if(error.statusCode==StatusCodes.NOT_FOUND)
        {
            throw new AppError('The airplane you requested to update is not present ',error.statusCode);
        }
        throw new AppError('Not able to fectch data of all the airplanes',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}
module.exports={
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
}
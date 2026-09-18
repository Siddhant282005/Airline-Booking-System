const {CityRepository}=require('../repositories');
 
const {StatusCodes}=require('http-status-codes');
const AppError=require('../utils/errors/app-error');

const cityRepository=new CityRepository();

async function createCity(data){
    try{
        const city= await cityRepository.create(data);
        return city;
    }catch(error){
        if(error.name =="SequelizeUniqueConstraintError"){
            let explanation =[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            const appError = new AppError(explanation.join(', '),StatusCodes.BAD_REQUEST);
            throw appError;
        }
        if(error.name=='SequelizeValidationError'){
            let explanation =[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            const appError = new AppError(explanation.join(', '),StatusCodes.BAD_REQUEST);
            throw appError;
        }
        throw new AppError('Failed to create city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyCity(id){
    try{
        const response = await cityRepository.destroy(id);
        return response;
    }catch(error){
         if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The city you requested to delete is not present',StatusCodes.NOT_FOUND);
        }
        const appError = new AppError('Cannot delete city',StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError; 
    }
}

async function getCities() {
    try {
        const cities = await cityRepository.getAll();
        return cities;
    } catch (error) {
        const appError = new AppError('Cannot fetch data of all cities', StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

async function getCity(id) {
    try {
        const city = await cityRepository.get(id);
        return city;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('The city you requested is not present', StatusCodes.NOT_FOUND);
        }
        const appError = new AppError('Cannot fetch city data', StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

async function updateCity(data, id) {
    try {
        const response = await cityRepository.update(id, data);
        return response;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('The city you requested to update is not present', error.statusCode);
        }
        if (error.name == "SequelizeUniqueConstraintError") {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            const appError = new AppError(explanation.join(', '), StatusCodes.BAD_REQUEST);
            throw appError;
        }
        if (error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            const appError = new AppError(explanation.join(', '), StatusCodes.BAD_REQUEST);
            throw appError;
        }
        throw new AppError('Not able to update city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    createCity,
    getCities,
    getCity,
    destroyCity,
    updateCity,
}
const {FlightRepository}=require('../repositories');

const {Op}=require('sequelize');
const {StatusCodes}=require('http-status-codes');
const AppError=require('../utils/errors/app-error');
const {validateFlightTimes}=require('../utils/helpers/datatime-helpers');
const flightRepository=new FlightRepository();

async function createFlight(data){
    try{
        // Validate that departure time is before arrival time
        if (!validateFlightTimes(data.departureTime, data.arrivalTime)) {
            throw new AppError('Departure time must be before arrival time', StatusCodes.BAD_REQUEST);
        }
        
        const flight= await flightRepository.create(data);
        return flight;
    }catch(error){
        console.log('Flight creation error:', error);
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
        
        if(error.name=='SequelizeForeignKeyConstraintError'){
            const appError = new AppError('Invalid airplaneId or airportId provided',StatusCodes.BAD_REQUEST);
            throw appError;
        }
        
        const appError = new AppError(`Cannot create a new flight object: ${error.message}`,StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

async function getFlights(){
    try{
        const flights= await flightRepository.getAll();
        return flights;
    }catch(error){
        const appError = new AppError('Cannot fetch data of all flights',StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

async function getFlight(id){
    try{
        const flight = await flightRepository.get(id);
        return flight;
    }catch(error){
        if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The flight you requested is not present',StatusCodes.NOT_FOUND);
        }
        const appError = new AppError('Cannot fetch flight data',StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

async function getAllFlights(filter){
    let customFilter={};
    const endingTripTime=' 23:59:00';
    let sortFilter=[];
    //trips=MUM-DEL
    if(filter.trips){
        const trips=filter.trips.split('-');
        customFilter={
            departureAirportId: trips[0],
            arrivalAirportId: trips[1]
        };
        //TODO :add a check that they are not same
        if (customFilter.departureAirportId === customFilter.arrivalAirportId) {
            throw new AppError('Departure and arrival airports cannot be the same', StatusCodes.BAD_REQUEST);
        }
    }
    if(filter.price){
        let [minPrice,maxPrice]=filter.price.split('-');
        customFilter.price={
            [Op.between]:[minPrice,(maxPrice==undefined)?20000:maxPrice]
        };
    }
    if(filter.travellers){
        customFilter.totalSeats={
            [Op.gte]:filter.travellers
        };
    }
    if(filter.tripDate){
        customFilter.departureTime={
            [Op.between]:[filter.tripDate,filter.tripDate + endingTripTime]
        };
    }
    if(filter.sort){
        const params=filter.sort.split(',');
        const sortFilters=params.map((param)=>param.split('_'));
        sortFilter=sortFilters;
    }
    try{
        const flights= await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    }catch(error){
        const appError = new AppError('Cannot fetch flights data', StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}


async function updateSeats(data) {
    try {
        const response = await flightRepository.updateSeats(data.flightId, data.seats, data.dec);
        return response;
    } catch (error) {
        const appError = new AppError('Cannot update seats', StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

async function destroyFlight(id){
    try{
        const flight = await flightRepository.destroy(id);
        return flight;
    }catch(error){
        if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The flight you requested to delete is not present',StatusCodes.NOT_FOUND);
        }
        const appError = new AppError('Cannot delete flight data',StatusCodes.INTERNAL_SERVER_ERROR);
        throw appError;
    }
}

module.exports={
    createFlight,
    getFlights,
    getFlight,
    getAllFlights,
    updateSeats,
    destroyFlight
}
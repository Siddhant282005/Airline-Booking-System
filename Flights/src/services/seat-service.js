const { SeatRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const seatRepository = new SeatRepository();

async function getSeatsForFlight(flightId) {
    try {
        const seats = await seatRepository.getAllSeatsForFlight(flightId);
        return seats;
    } catch (error) {
        throw new AppError('Cannot fetch seats', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAvailableSeatsForFlight(flightId) {
    try {
        const seats = await seatRepository.getAvailableSeatsForFlight(flightId);
        return seats;
    } catch (error) {
        throw new AppError('Cannot fetch available seats', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function bookSeats(data) {
    try {
        const { seatIds, flightId } = data;
        const result = await seatRepository.bookSeats(seatIds, flightId);
        if (result[0] === 0) {
            throw new AppError('Seats already booked or invalid seat IDs', StatusCodes.BAD_REQUEST);
        }
        return result;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot book seats', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function unbookSeats(seatIds) {
    try {
        const result = await seatRepository.unbookSeats(seatIds);
        return result;
    } catch (error) {
        throw new AppError('Cannot unbook seats', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    getSeatsForFlight,
    getAvailableSeatsForFlight,
    bookSeats,
    unbookSeats
};

const CrudRepository = require('./crud-repository');
const { Seat } = require('../models');
const { Op } = require('sequelize');

class SeatRepository extends CrudRepository {
    constructor() {
        super(Seat);
    }

    async getAvailableSeatsForFlight(flightId) {
        // First get the flight to find the airplaneId
        const flight = await this.model.sequelize.models.Flight.findByPk(flightId);
        if (!flight) {
            throw new Error('Flight not found');
        }

        // Get all seats for this airplane that are either unassigned or assigned to this flight and not booked
        const response = await Seat.findAll({
            where: {
                airplaneId: flight.airplaneId,
                isBooked: false,
                [Op.or]: [
                    { flightId: null },
                    { flightId: flightId }
                ]
            },
            order: [['row', 'ASC'], ['col', 'ASC']]
        });
        return response;
    }

    async getAllSeatsForFlight(flightId) {
        // First get the flight to find the airplaneId
        const flight = await this.model.sequelize.models.Flight.findByPk(flightId);
        if (!flight) {
            throw new Error('Flight not found');
        }

        // Get all seats for this airplane
        const response = await Seat.findAll({
            where: {
                airplaneId: flight.airplaneId,
                [Op.or]: [
                    { flightId: null },
                    { flightId: flightId }
                ]
            },
            order: [['row', 'ASC'], ['col', 'ASC']]
        });
        return response;
    }

    async getSeatsByAirplane(airplaneId) {
        const response = await Seat.findAll({
            where: {
                airplaneId: airplaneId,
                flightId: null
            },
            order: [['row', 'ASC'], ['col', 'ASC']]
        });
        return response;
    }

    async bookSeats(seatIds, flightId) {
        const response = await Seat.update(
            { isBooked: true, flightId: flightId },
            {
                where: {
                    id: {
                        [Op.in]: seatIds
                    },
                    isBooked: false
                }
            }
        );
        return response;
    }

    async unbookSeats(seatIds) {
        const response = await Seat.update(
            { isBooked: false, flightId: null },
            {
                where: {
                    id: {
                        [Op.in]: seatIds
                    }
                }
            }
        );
        return response;
    }
}

module.exports = SeatRepository;

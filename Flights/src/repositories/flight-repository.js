const {Sequelize}=require('sequelize');

const CrudRepository=require('./crud-repository');
const {Flight,Airplane,Airport,City}=require('../models');
const db=require('../models');

const {addRowLockOnFlights}=require('./queries');
class FlightRepository extends CrudRepository{
    constructor(){
        super(Flight);
    }

    async getAllFlights(filter, sort){
        const response=await Flight.findAll({
            where:filter,
            order:sort,
            include:[
                {
                model:Airplane,
                required:true,
                as: 'airplaneDetail'
                },
                {
                    model :Airport,
                    required:true,
                    as : 'departureAirport',
                    on:{
                        col1:Sequelize.where(Sequelize.col("Flight.departureAirportId"),"=",Sequelize.col("departureAirport.code"))
                    },
                    include:{
                        model:City,
                        required:true,
                    }
                },
                {
                    model :Airport,
                    required:true,
                    as : 'arrivalAirport',
                    on:{
                        col1:Sequelize.where(Sequelize.col("Flight.arrivalAirportId"),"=",Sequelize.col("arrivalAirport.code"))
                    },
                    include:{
                        model:City,
                        required:true,
                    }
                }
            ]
        });
        return response;
    }

    async updateSeats(flightId, seats, dec = true) {
        const transaction = await db.sequelize.transaction();
        try {
            // Ensure seats is a positive integer
            const seatsNum = Number(seats);
            if (!Number.isFinite(seatsNum) || seatsNum <= 0) {
                throw new Error('Invalid seats value');
            }

            // Lock the row and fetch inside the transaction
            await db.sequelize.query(addRowLockOnFlights(flightId), { transaction });
            const flight = await Flight.findByPk(flightId, { transaction, lock: transaction.LOCK.UPDATE });
            if (!flight) {
                const notFound = new Error('Flight not found');
                notFound.statusCode = 404;
                throw notFound;
            }

            const shouldDecrement = (dec === true || dec === 'true' || dec === 1 || dec === '1');

            if (shouldDecrement) {
                // Prevent going below zero
                if (flight.totalSeats < seatsNum) {
                    const err = new Error('Not enough seats to decrement');
                    err.statusCode = 400;
                    throw err;
                }
                await flight.decrement('totalSeats', { by: seatsNum, transaction });
            } else {
                await flight.increment('totalSeats', { by: seatsNum, transaction });
            }

            // Reload to get the updated values within the transaction
            await flight.reload({ transaction });
            await transaction.commit();
            return flight;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
module.exports=FlightRepository;
const {StatusCodes} = require('http-status-codes');

const {Booking} = require('../models');
const CrudRepository = require('./crud-repository');
const AppError = require('../utils/errors/app-error');
const {Op} = require('sequelize');
const { Enums } = require('../utils/common');
const { CANCELLED, BOOKED } = Enums.BOOKING_STATUS;
class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data, transaction){
        const response = await Booking.create(data, {transaction});
        return response;
    }

    async get(data, transaction){
        const response = await this.model.findByPk(data,{transaction});
        if(!response){
            throw new AppError('Booking not found', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction){
        const response = await this.model.update(data,{
            where:{id},
            returning:true,
            transaction
        });
        return response;
    }

    async cancelOldBookings(timestamp) {
        // Return candidates eligible for cancellation (older than timestamp and not finalised)
        const candidates = await Booking.findAll({
            where: {
                createdAt: { [Op.lt]: timestamp },
                status: { [Op.notIn]: [BOOKED, CANCELLED] }
            }
        });
        return candidates || [];
    }

    async getByUserId(userId) {
        // List bookings created by a specific user.
        // This endpoint should return an empty list if the user has no bookings.
        return this.model.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
    }
}


module.exports = BookingRepository;
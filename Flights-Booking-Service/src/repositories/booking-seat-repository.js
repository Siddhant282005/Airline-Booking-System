const CrudRepository = require('./crud-repository');
const { BookingSeat } = require('../models');

class BookingSeatRepository extends CrudRepository {
    constructor() {
        super(BookingSeat);
    }

    async createBulk(bookingSeats, transaction) {
        const response = await BookingSeat.bulkCreate(bookingSeats, { transaction });
        return response;
    }

    async getByBookingId(bookingId) {
        const response = await BookingSeat.findAll({
            where: {
                bookingId: bookingId
            }
        });
        return response;
    }

    async deleteByBookingId(bookingId) {
        const response = await BookingSeat.destroy({
            where: {
                bookingId: bookingId
            }
        });
        return response;
    }
}

module.exports = BookingSeatRepository;

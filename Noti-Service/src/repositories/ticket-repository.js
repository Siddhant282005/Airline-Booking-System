const CrudRepository = require('./crud-repository');
const db= require('../models');

class TicketRepository extends CrudRepository{
    constructor(){
        super(db.Ticket);
    }

    async getPendingTickets(){
        const response= await Ticket.findAll({
            where: {
                status: 'PENDING'
            }
        });
        return response;
    }
}


module.exports = TicketRepository;

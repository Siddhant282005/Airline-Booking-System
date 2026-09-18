const CrudRepository = require('./crud-repository');

const { User } = require('../models');
class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserByEmail(email) {
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        return user;
    }

    async getAll() {
        return this.model.findAll({ attributes: ['id', 'email', 'createdAt'] });
    }
}


module.exports = UserRepository;
const { Logger } = require('../config');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
            const response = await this.model.create(data);
            return response;  
    }

    async destroy(data) {
        const response = await this.model.destroy({
            where: {
                id :data 
            }
         });
         if(!response){
            throw new AppError('Not able to delete the resource',StatusCodes.NOT_FOUND);
         }
        return response; // returns number of rows deleted
    }

    async get(data) {
            const response = await this.model.findByPk(data);
            if(!response){
                throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND);
            }
            return response;
    }
    async getAll() {
            const response = await this.model.findAll();
            return response;
    }
    async update(id,data) {//data ->{col:value, ....}
        const [affectedRowCount] = await this.model.update(data,{
            where:{
                id:id
            }
        });
        if(!affectedRowCount){
            throw new AppError('Not able to update the resource',StatusCodes.NOT_FOUND);
        }
        const updatedEntity = await this.model.findByPk(id);
        return updatedEntity;
    }
}

module.exports = CrudRepository;

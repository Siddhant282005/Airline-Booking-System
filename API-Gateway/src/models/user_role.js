'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Role.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'userId'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'roleId'
    }
  }, {
    sequelize,
    modelName: 'User_Role',
    underscored: false
  });
  return User_Role;
};
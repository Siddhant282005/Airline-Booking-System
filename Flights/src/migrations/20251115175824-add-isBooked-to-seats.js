'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Seats', 'isBooked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    
    await queryInterface.addColumn('Seats', 'flightId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Flights',
        key: 'id'
      },
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Seats', 'isBooked');
    await queryInterface.removeColumn('Seats', 'flightId');
  }
};

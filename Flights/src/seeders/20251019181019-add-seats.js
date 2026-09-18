'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Seats', [
      {
        airplaneId: 1,
        row: 1,
        col: 'A',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airplaneId: 1,
        row: 1,
        col: 'B',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airplaneId: 1,
        row: 1,
        col: 'C',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airplaneId: 1,
        row: 1,
        col: 'D',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airplaneId: 1,
        row: 1,
        col: 'E',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airplaneId: 1,
        row: 1,
        col: 'F',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airplaneId: 1,
        row: 2,
        col: 'A',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airplaneId: 1,
        row: 2,
        col: 'B',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()   
      },
      {
        airplaneId: 1,
        row: 2,
        col: 'C',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()   
      },
      {
        airplaneId: 1,      
        row: 2,
        col: 'D',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()   
      },
      {
        airplaneId: 1,
        row: 2,
        col: 'E',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()   
      },
      {
        airplaneId: 1,
        row: 2,
        col: 'F',
        isBooked: false,
        flightId: null,
        createdAt: new Date(),
        updatedAt: new Date()   
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

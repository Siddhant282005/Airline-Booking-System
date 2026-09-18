'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('Airports', {
      fields: ['cityId'],
      type: 'foreign key',
      name: 'fk_airport_city',
      references: {
        table: 'Cities',
        field: 'id'
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('Airports', 'fk_airport_city');
  }
};

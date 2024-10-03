'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CardTransfers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cityfrom: {
        type: Sequelize.STRING
      },
      cityto: {
        type: Sequelize.STRING
      },
      timefrom: {
        type: Sequelize.STRING
      },
      timeto: {
        type: Sequelize.STRING
      },
      datefrom: {
        type: Sequelize.STRING
      },
      dateto: {
        type: Sequelize.STRING
      },
      car: {
        type: Sequelize.STRING
      },
      typeCar: {
        type: Sequelize.STRING
      },
      passenger: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CardTransfers');
  }
};
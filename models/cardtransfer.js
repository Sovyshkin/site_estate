'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardTransfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CardTransfer.init({
    cityfrom: DataTypes.STRING,
    cityto: DataTypes.STRING,
    timefrom: DataTypes.STRING,
    timeto: DataTypes.STRING,
    walkfrom: DataTypes.STRING,
    walkto: DataTypes.STRING,
    cars: DataTypes.STRING,
    price: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CardTransfer',
  });
  return CardTransfer;
};
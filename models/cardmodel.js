'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CardModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CardModel.init({
    subcategory: DataTypes.STRING, // создать subcategory
    category: DataTypes.STRING,
    title: DataTypes.STRING,
    img: DataTypes.JSON,
    p: DataTypes.STRING,
    price: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    nameCard: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CardModel',
  });
  return CardModel;
};
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FoodCategory = sequelize.define('FoodCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'FoodCategories',
  timestamps: false
});

module.exports = FoodCategory;

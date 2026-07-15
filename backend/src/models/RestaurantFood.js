const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Bảng trung gian cho Menu quán ăn (1 quán có nhiều món, 1 món ở nhiều quán)
const RestaurantFood = sequelize.define('RestaurantFood', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Giá thực tế của món ăn tại quán này'
  }
}, {
  tableName: 'RestaurantFoods',
  timestamps: true
});

module.exports = RestaurantFood;

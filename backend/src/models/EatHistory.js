const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const EatHistory = sequelize.define('EatHistory', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'EatHistories',
  timestamps: true // This adds createdAt and updatedAt, we can use createdAt as eatDate
});

module.exports = EatHistory;

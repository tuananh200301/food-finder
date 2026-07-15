const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Favorite = sequelize.define('Favorite', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  targetType: {
    type: DataTypes.ENUM('food', 'restaurant'),
    allowNull: false
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Favorites',
  timestamps: true
});

module.exports = Favorite;

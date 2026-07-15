const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Restaurant = sequelize.define('Restaurant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ví dụ: Quận 1, Quận 2...'
  },
  googleMapsUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hotline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  openTime: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: '08:00:00'
  },
  closeTime: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: '22:00:00'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hasSeating: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  hasDelivery: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Restaurants',
  timestamps: true
});

module.exports = Restaurant;

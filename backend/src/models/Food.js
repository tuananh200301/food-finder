const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Food = sequelize.define('Food', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referencePrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Giá tham khảo chung'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Foods',
  timestamps: true
});

module.exports = Food;

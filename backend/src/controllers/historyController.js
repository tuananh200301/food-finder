const { EatHistory, User, Food, Restaurant } = require('../models');
const { Op } = require('sequelize');

exports.markAsEaten = async (req, res) => {
  try {
    const { userId, foodId, restaurantId, note } = req.body;
    
    if (!userId || !foodId || !restaurantId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newHistory = await EatHistory.create({
      userId,
      foodId,
      restaurantId,
      note,
      image: imagePath
    });

    res.status(201).json({ success: true, data: newHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Support filtering by foodId and restaurantId if provided via query
    const { foodId, restaurantId, date } = req.query;
    const whereClause = { userId };
    if (foodId) whereClause.foodId = foodId;
    if (restaurantId) whereClause.restaurantId = restaurantId;
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      whereClause.createdAt = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    const histories = await EatHistory.findAll({
      where: whereClause,
      include: [
        { model: Food, attributes: ['id', 'name', 'image'] },
        { model: Restaurant, attributes: ['id', 'name', 'address'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: histories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getAllHistory = async (req, res) => {
  try {
    const histories = await EatHistory.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Food, attributes: ['id', 'name'] },
        { model: Restaurant, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: histories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

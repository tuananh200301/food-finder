const { Food, Restaurant, Category, RestaurantFood, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getRandomSuggestion = async (req, res) => {
  try {
    const { categoryId, area, minPrice, maxPrice, openNow } = req.query;

    // Build conditions for Restaurant
    const restaurantConditions = {};
    if (area) {
      restaurantConditions.area = area;
    }
    
    if (openNow === 'true') {
      const nowTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
      restaurantConditions.openTime = { [Op.lte]: nowTime };
      restaurantConditions.closeTime = { [Op.gte]: nowTime };
    }

    // Build conditions for Food
    const foodIncludeConditions = [];
    if (categoryId) {
      foodIncludeConditions.push({
        model: Category,
        where: { id: categoryId },
        attributes: []
      });
    }

    // Find all valid menus (RestaurantFood)
    let menuConditions = {};
    if (minPrice || maxPrice) {
      menuConditions.price = {};
      if (minPrice) menuConditions.price[Op.gte] = minPrice;
      if (maxPrice) menuConditions.price[Op.lte] = maxPrice;
    }

    // Fetch matching data
    const restaurants = await Restaurant.findAll({
      where: restaurantConditions,
      include: [
        {
          model: Food,
          through: {
            model: RestaurantFood,
            where: menuConditions
          },
          include: foodIncludeConditions
        }
      ]
    });

    // Flatten valid suggestions
    let validSuggestions = [];
    restaurants.forEach(restaurant => {
      restaurant.Food.forEach(food => {
        validSuggestions.push({
          food,
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            area: restaurant.area,
            image: restaurant.image,
            openTime: restaurant.openTime,
            closeTime: restaurant.closeTime,
            price: food.RestaurantFood.price
          }
        });
      });
    });

    if (validSuggestions.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy gợi ý phù hợp.' });
    }

    // Randomize
    const randomIndex = Math.floor(Math.random() * validSuggestions.length);
    const suggestion = validSuggestions[randomIndex];

    res.json({ success: true, data: suggestion });
  } catch (error) {
    console.error("Lỗi gợi ý món ăn:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

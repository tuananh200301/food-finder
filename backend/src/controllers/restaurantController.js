const { Restaurant, Food, RestaurantFood } = require('../models');

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [{ model: Food, through: { attributes: ['price'] } }]
    });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Restaurant.update(req.body, { where: { id } });
    if (updated) {
      const updatedRestaurant = await Restaurant.findByPk(id);
      return res.json({ success: true, data: updatedRestaurant });
    }
    res.status(404).json({ success: false, message: 'Restaurant not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Restaurant.destroy({ where: { id } });
    if (deleted) {
      return res.json({ success: true, message: 'Restaurant deleted' });
    }
    res.status(404).json({ success: false, message: 'Restaurant not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Menu management (add food to restaurant)
exports.addFoodToMenu = async (req, res) => {
  try {
    const { id } = req.params; // restaurantId
    const { foodId, price } = req.body;
    
    // Check if restaurant and food exist
    const restaurant = await Restaurant.findByPk(id);
    const food = await Food.findByPk(foodId);
    
    if (!restaurant || !food) return res.status(404).json({ success: false, message: 'Restaurant or Food not found' });
    
    const [menuItem, created] = await RestaurantFood.findOrCreate({
      where: { restaurantId: id, foodId },
      defaults: { price }
    });
    
    if (!created) {
      await menuItem.update({ price });
    }
    
    res.json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.removeFoodFromMenu = async (req, res) => {
  try {
    const { id, foodId } = req.params;
    const deleted = await RestaurantFood.destroy({ where: { restaurantId: id, foodId } });
    if (deleted) {
      return res.json({ success: true, message: 'Food removed from menu' });
    }
    res.status(404).json({ success: false, message: 'Menu item not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const { User, Food, Restaurant, Review } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalFoods = await Food.count();
    const totalRestaurants = await Restaurant.count();
    const totalReviews = await Review.count();
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalFoods,
        totalRestaurants,
        totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

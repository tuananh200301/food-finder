const { Review, Favorite, User, Food, Restaurant } = require('../models');

exports.addReview = async (req, res) => {
  try {
    // Requires authentication, assuming req.user is set
    const userId = req.user?.id || 1; // fallback to 1 for MVP if no auth middleware used yet
    const { targetType, targetId, rating, comment, image } = req.body;
    
    const review = await Review.create({ userId, targetType, targetId, rating, comment, image });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { targetType, targetId } = req.body;
    
    const existing = await Favorite.findOne({ where: { userId, targetType, targetId } });
    if (existing) {
      await existing.destroy();
      return res.json({ success: true, message: 'Removed from favorites', isFavorite: false });
    }
    
    await Favorite.create({ userId, targetType, targetId });
    res.json({ success: true, message: 'Added to favorites', isFavorite: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const User = require('./User');
const Category = require('./Category');
const Food = require('./Food');
const Restaurant = require('./Restaurant');
const RestaurantFood = require('./RestaurantFood');
const Review = require('./Review');
const Favorite = require('./Favorite');
const FoodCategory = require('./FoodCategory');
const EatHistory = require('./EatHistory');

// Relationships

// Food - Category (Many-to-Many)
Food.belongsToMany(Category, { through: FoodCategory, foreignKey: 'foodId' });
Category.belongsToMany(Food, { through: FoodCategory, foreignKey: 'categoryId' });

// Food - Restaurant (Many-to-Many via RestaurantFood)
Food.belongsToMany(Restaurant, { through: RestaurantFood, foreignKey: 'foodId' });
Restaurant.belongsToMany(Food, { through: RestaurantFood, foreignKey: 'restaurantId' });

// We can also define 1-to-Many for direct access if needed
Restaurant.hasMany(RestaurantFood, { foreignKey: 'restaurantId' });
RestaurantFood.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Food.hasMany(RestaurantFood, { foreignKey: 'foodId' });
RestaurantFood.belongsTo(Food, { foreignKey: 'foodId' });

// User - Review (1-to-Many)
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// User - Favorite (1-to-Many)
User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

// EatHistory Relationships
User.hasMany(EatHistory, { foreignKey: 'userId' });
EatHistory.belongsTo(User, { foreignKey: 'userId' });

Food.hasMany(EatHistory, { foreignKey: 'foodId' });
EatHistory.belongsTo(Food, { foreignKey: 'foodId' });

Restaurant.hasMany(EatHistory, { foreignKey: 'restaurantId' });
EatHistory.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

module.exports = {
  User,
  Category,
  Food,
  Restaurant,
  RestaurantFood,
  Review,
  Favorite,
  FoodCategory,
  EatHistory
};

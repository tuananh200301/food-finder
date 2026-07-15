const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', restaurantController.createRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);

// Add food to menu
router.post('/:id/menu', restaurantController.addFoodToMenu);
router.delete('/:id/menu/:foodId', restaurantController.removeFoodFromMenu);

module.exports = router;

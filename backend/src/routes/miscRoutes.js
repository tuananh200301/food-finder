const express = require('express');
const router = express.Router();
const userActionController = require('../controllers/userActionController');
const adminController = require('../controllers/adminController');

router.post('/review', userActionController.addReview);
router.post('/favorite', userActionController.toggleFavorite);

router.get('/stats', adminController.getDashboardStats);

module.exports = router;

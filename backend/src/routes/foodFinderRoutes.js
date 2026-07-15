const express = require('express');
const router = express.Router();
const foodFinderController = require('../controllers/foodFinderController');

router.get('/random', foodFinderController.getRandomSuggestion);

module.exports = router;

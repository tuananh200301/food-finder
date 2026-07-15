const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const upload = require('../middleware/uploadMiddleware');

// User routes
router.post('/', upload.single('image'), historyController.markAsEaten);
router.get('/user/:userId', historyController.getUserHistory);

// Admin route
router.get('/admin', historyController.getAllHistory);

module.exports = router;

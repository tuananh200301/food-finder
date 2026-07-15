const express = require('express');
const { googleLogin, register, login, setupAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/google', googleLogin);
router.post('/register', register);
router.post('/login', login);
router.post('/setup-admin', setupAdmin);

module.exports = router;

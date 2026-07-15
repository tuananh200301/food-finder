const express = require('express');
const { getAllUsers, updateUser, deleteUser, changeMyPassword, resetUserPassword, createAdmin } = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Tự đổi mật khẩu (yêu cầu đăng nhập, không cần admin)
router.put('/change-my-password', verifyToken, changeMyPassword);

// Tất cả các route bên dưới đều yêu cầu quyền admin
router.use(verifyToken, isAdmin);

router.post('/admin', createAdmin);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.put('/:id/reset-password', resetUserPassword);
router.delete('/:id', deleteUser);

module.exports = router;

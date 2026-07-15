const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Lấy danh sách tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['id', 'ASC']]
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Cập nhật thông tin/vai trò người dùng
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // Hiện tại chỉ cho update role, có thể thêm trường khác

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Cấm tự hạ quyền của chính mình nếu là admin duy nhất (tuỳ chọn, tạm bỏ qua để đơn giản)
    if (role && ['user', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();
    res.status(200).json({ success: true, user, message: 'Cập nhật thành công' });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Xoá người dùng
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Không thể tự xoá tài khoản của chính mình' });
    }

    await user.destroy();
    res.status(200).json({ success: true, message: 'Xoá người dùng thành công' });
  } catch (error) {
    console.error("Lỗi khi xoá người dùng:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Tự đổi mật khẩu (Dành cho User & Admin)
const changeMyPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu cũ và mới' });
    }

    const user = await User.findByPk(req.user.id);
    
    // Nếu user đăng ký bằng Google thì không có password cũ (hoặc password rỗng)
    if (user.password) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác' });
      }
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Reset mật khẩu của người khác (Chỉ Admin)
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu mới' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Tạo Admin mới (Chỉ Admin)
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name)
    });

    res.status(201).json({ success: true, message: 'Tạo tài khoản Admin thành công', user: newAdmin });
  } catch (error) {
    console.error("Lỗi khi tạo admin:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  changeMyPassword,
  resetUserPassword,
  createAdmin
};

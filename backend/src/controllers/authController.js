const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Hàm hỗ trợ tạo JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret-key-default',
    { expiresIn: '7d' }
  );
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify token từ phía client gửi lên
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // Tìm kiếm user trong DB hoặc tạo mới nếu chưa tồn tại
    let [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        googleId,
        email,
        name,
        avatar
      }
    });

    // Nếu user đã tồn tại nhưng chưa có googleId (đăng ký thường trước đó)
    if (!created && !user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // Cập nhật thông tin nếu có thay đổi
    if (!created && (user.name !== name || user.avatar !== avatar)) {
      user.name = name;
      if (avatar) user.avatar = avatar;
      await user.save();
    }

    const accessToken = generateToken(user);

    res.status(200).json({
      success: true,
      user,
      token: accessToken
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ success: false, message: 'Xác thực Google thất bại' });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name)
    });

    const token = generateToken(user);

    res.status(201).json({ success: true, user, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền email và mật khẩu' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không chính xác (Có thể bạn đã đăng nhập bằng Google)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    const token = generateToken(user);

    res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập' });
  }
};

const initAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    let user = await User.findOne({ where: { email: adminEmail } });
    
    if (user) {
      console.log('Tài khoản admin đã tồn tại');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    user = await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=random'
    });

    console.log('Đã tạo tài khoản admin thành công');
  } catch (error) {
    console.error("Lỗi khi tạo admin tự động:", error);
  }
};

const setupAdmin = async (req, res) => {
  try {
    await initAdmin();
    res.status(200).json({ success: true, message: 'Đã kiểm tra và thiết lập tài khoản admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo admin' });
  }
};

module.exports = {
  googleLogin,
  register,
  login,
  setupAdmin,
  initAdmin
};

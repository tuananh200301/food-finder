require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
require('./models'); // Require models để load associations

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/food-finder', require('./routes/foodFinderRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/misc', require('./routes/miscRoutes'));

// Khởi động server
const startServer = async () => {
  try {
    // Kết nối Database
    await connectDB();
    
    // Sync models (tạo bảng nếu chưa có)
    // Lưu ý: Trong môi trường production, thường dùng migrations (vd: Sequelize CLI) thay vì sync
    // await sequelize.sync({ alter: true });
    await sequelize.sync();
    console.log('Database synced');

    // Tự động tạo admin nếu chưa có
    const { initAdmin } = require('./controllers/authController');
    await initAdmin();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Lỗi khi khởi động server:', error);
  }
};

startServer();

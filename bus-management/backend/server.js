const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const khachHangRoutes = require('./routes/khachHangRoutes');
const authRoutes = require('./routes/authRoutes');
const chuyenXeRoutes = require('./routes/chuyenXeRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

// Tải biến môi trường
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/khachhang', khachHangRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chuyenxe', chuyenXeRoutes);

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
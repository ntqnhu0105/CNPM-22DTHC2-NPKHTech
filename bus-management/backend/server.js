const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const khachHangRoutes = require('./routes/khachHangRoutes');
const authRoutes = require('./routes/authRoutes');
const chuyenXeRoutes = require('./routes/chuyenXeRoutes');
const cskhRoutes = require('./routes/cskhRoutes');
const danhGiaRoutes = require('./routes/danhGiaRoutes');
const khuyenMaiRoutes = require('./routes/khuyenMaiRoutes');
const lichSuVeXeRoutes = require('./routes/lichSuVeXeRoutes');
const loaiXeRoutes = require('./routes/loaiXeRoutes');
const nhaXeRoutes = require('./routes/nhaXeRoutes');
const nhanVienRoutes = require('./routes/nhanVienRoutes');
const soGheSoGiuongRoutes = require('./routes/soGheSoGiuongRoutes');
const taiXeRoutes = require('./routes/taiXeRoutes');
const thanhToanRoutes = require('./routes/thanhToanRoutes');
const thongBaoRoutes = require('./routes/thongBaoRoutes');
const tuyenXeRoutes = require('./routes/tuyenXeRoutes');
const userRoutes = require('./routes/userRoutes');
const veXeRoutes = require('./routes/veXeRoutes');
const xeRoutes = require('./routes/xeRoutes');
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
app.use('/api/cskh', cskhRoutes);
app.use('/api/danhgia', danhGiaRoutes);
app.use('/api/khuyenmai', khuyenMaiRoutes);
app.use('/api/lichsuve', lichSuVeXeRoutes);
app.use('/api/loaixe', loaiXeRoutes);
app.use('/api/nhaxe', nhaXeRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/soghesogiuong', soGheSoGiuongRoutes);
app.use('/api/taixe', taiXeRoutes);
app.use('/api/thanhtoan', thanhToanRoutes);
app.use('/api/thongbao', thongBaoRoutes);
app.use('/api/tuyenxe', tuyenXeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vexe', veXeRoutes);
app.use('/api/xe', xeRoutes);

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));

module.exports = {
  ChuyenXe: require('./chuyenXe'),
  CSKH: require('./cskh'),
  DanhGia: require('./danhGia'),
  KhachHang: require('./khachHang'),
  KhuyenMai: require('./khuyenMai'),
  LichSuVeXe: require('./lichSuVeXe'),
  LoaiXe: require('./loaiXe'),
  NhaXe: require('./nhaXe'),
  NhanVien: require('./nhanVien'),
  SoGheSoGiuong: require('./soGheSoGiuong'),
  TaiXe: require('./taiXe'),
  ThanhToan: require('./thanhToan'),
  ThongBao: require('./thongBao'),
  TuyenXe: require('./tuyenXe'),
  User: require('./user'),
  VeXe: require('./veXe'),
  Xe: require('./xe'),
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, KhachHang } = require('../models');

const register = async ({ username, password, role, hoVaTen, sdt, email, cccd, diaChi, ngaySinh }) => {
  let khachHangId = null;

  if (role === 'Customer') {
    // Validate required fields for customer
    if (!cccd) throw new Error('CCCD là bắt buộc cho khách hàng');
    if (!email) throw new Error('Email là bắt buộc cho khách hàng');
    if (!hoVaTen) throw new Error('Họ và tên là bắt buộc cho khách hàng');
    if (!sdt) throw new Error('Số điện thoại là bắt buộc cho khách hàng');

    // Check if CCCD already exists
    const existingKhachHang = await KhachHang.findOne({ cccd });
    if (existingKhachHang) throw new Error('CCCD đã tồn tại');

    // Create customer with all fields
    const khachHang = new KhachHang({ 
      cccd, 
      email, 
      hoVaTen, 
      sdt, 
      diaChi: diaChi || '', 
      ngaySinh: ngaySinh ? new Date(ngaySinh) : null 
    });
    await khachHang.save();
    khachHangId = khachHang._id;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, passwordHash, role, khachHangId });
  await user.save();

  const token = jwt.sign(
    { userId: user._id, role: user.role, khachHangId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user };
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Người dùng không tồn tại');
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Mật khẩu không đúng');
  
  // Tạo token chứa khachHangId
  const token = jwt.sign(
    { userId: user._id, role: user.role, khachHangId: user.khachHangId }, // Thêm khachHangId
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  user.lastLogin = new Date();
  await user.save();
  return { token, user: { id: user._id, username: user.username, role: user.role, khachHangId: user.khachHangId } };
};

module.exports = { register, login };
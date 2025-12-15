const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, KhachHang } = require('../models');
const sendEmail = require('../utils/emailHelper');

const findUserByEmail = async (email) => {
  let user = await User.findOne({ email });

  if (!user) {
    const khachHang = await KhachHang.findOne({ email });
    if (khachHang) {
      user = await User.findOne({ khachHangId: khachHang._id });
    }
  }

  return user;
};

const register = async ({ username, password, role, hoVaTen, sdt, email, cccd, diaChi, ngaySinh }) => {
  let khachHangId = null;

  if (role === 'Customer') {
    if (!cccd || !email || !hoVaTen || !sdt) {
      throw new Error('Thiếu thông tin bắt buộc cho khách hàng');
    }

    const existingKhachHang = await KhachHang.findOne({ 
        $or: [{ cccd }, { email }, { sdt }] 
    });
    if (existingKhachHang) throw new Error('Thông tin khách hàng (CCCD/Email/SĐT) đã tồn tại');

    const khachHang = new KhachHang({ 
      cccd, email, hoVaTen, sdt, 
      diaChi: diaChi || '', 
      ngaySinh: ngaySinh ? new Date(ngaySinh) : null 
    });
    await khachHang.save();
    khachHangId = khachHang._id;
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error('Tên đăng nhập đã tồn tại');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({ 
    username, 
    passwordHash, 
    role, 
    khachHangId,
    email: email || undefined
  });
  
  await user.save();

  const token = jwt.sign(
    { userId: user._id, role: user.role, khachHangId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' } 
  );

  return { token, user };
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Người dùng không tồn tại');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Mật khẩu không đúng');
  
  const token = jwt.sign(
    { userId: user._id, role: user.role, khachHangId: user.khachHangId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  user.lastLogin = new Date();
  await user.save();
  return { token, user: { id: user._id, username: user.username, role: user.role, khachHangId: user.khachHangId } };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) throw new Error('Mật khẩu cũ không chính xác');

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  
  await user.save();
  return { message: 'Đổi mật khẩu thành công' };
};

// --- LOGIC QUÊN MẬT KHẨU ---
const forgotPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Email này chưa được đăng ký tài khoản nào');

  // Tạo OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút
  await user.save();

  const subject = 'Mã xác nhận đặt lại mật khẩu - EET';
  const content = `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 15 phút.`;
  
  await sendEmail(email, subject, content);

  return { message: 'Mã OTP đã được gửi đến email của bạn' };
};

const resetPassword = async (email, otp, newPassword) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Email không hợp lệ');

  // Kiểm tra OTP
  if (user.resetPasswordOtp !== otp) {
    throw new Error('Mã OTP không đúng');
  }
  if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
    throw new Error('Mã OTP đã hết hạn');
  }

  // Hash mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  
  // Xóa OTP
  user.resetPasswordOtp = null;
  user.resetPasswordExpires = null;
  
  await user.save();
  return { message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' };
};

module.exports = { register, login, changePassword, forgotPassword, resetPassword };
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, KhachHang } = require('../models');

const register = async ({ username, password, role, hoVaTen, sdt, email }) => {
  let khachHangId = null;

  if (role === 'Customer') {
    const khachHang = new KhachHang({ email, hoVaTen, sdt });
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
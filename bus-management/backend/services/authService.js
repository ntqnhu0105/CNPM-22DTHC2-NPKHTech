const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async ({ username, password, role, khachHangId }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash, role, khachHangId });
  return await user.save();
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Người dùng không tồn tại');
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Mật khẩu không đúng');
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  user.lastLogin = new Date();
  await user.save();
  return { token, user };
};

module.exports = { register, login };
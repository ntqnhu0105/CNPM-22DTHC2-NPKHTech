const { User } = require('../models');
const bcrypt = require('bcryptjs');

const getAllUser = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const users = await User.find()
    .select('-password')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await User.countDocuments();
  return { users, total, page, limit };
};

const createUser = async (data) => {
  const { username, password, role, email, phone } = data;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new Error('Tên đăng nhập hoặc email đã tồn tại');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role, email, phone });
  return await user.save();
};

const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Người dùng không tồn tại');

  const { username, password, role, email, phone } = data;
  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error('Tên đăng nhập đã tồn tại');
  }
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new Error('Email đã tồn tại');
  }
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  Object.assign(user, { username, password: data.password, role, email, phone });
  return await user.save();
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Người dùng không tồn tại');
  await user.deleteOne();
  return { message: 'Xóa người dùng thành công' };
};

module.exports = {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
};
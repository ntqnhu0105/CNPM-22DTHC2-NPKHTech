const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { NhanVien, User } = require('../models');

const getAllNhanVien = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const nhanViens = await NhanVien.find()
    .populate({
      path: 'userId',
      select: 'username',
    })
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await NhanVien.countDocuments();
  return { nhanViens, total, page, limit };
};

const createNhanVien = async (data) => {
  const { username, password, hoVaTen, sdt, chucVu } = data;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Tên đăng nhập đã tồn tại.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    passwordHash,
    role: 'Staff',
  });

  let savedUser;
  try {
    savedUser = await newUser.save();

    const newNhanVien = new NhanVien({
      hoVaTen,
      sdt,
      chucVu,
      nhaXeId: '66901689282315265435e0e7', // Hardcoded for now
      userId: savedUser._id,
    });
    const savedNhanVien = await newNhanVien.save();

    savedUser.nhanVienId = savedNhanVien._id;
    await savedUser.save();

    return savedNhanVien;
  } catch (error) {
    if (savedUser) {
      await User.findByIdAndDelete(savedUser._id);
    }
    console.error('Lỗi khi tạo nhân viên và tài khoản:', error);
    throw new Error('Đã xảy ra lỗi trong quá trình tạo nhân viên.');
  }
};

const updateNhanVien = async (id, data) => {
  const { hoVaTen, sdt, chucVu } = data;
  const nhanVien = await NhanVien.findById(id);
  if (!nhanVien) {
    throw new Error('Nhân viên không tồn tại');
  }

  nhanVien.hoVaTen = hoVaTen;
  nhanVien.sdt = sdt;
  nhanVien.chucVu = chucVu;

  return await nhanVien.save();
};

const deleteNhanVien = async (id) => {
  const nhanVien = await NhanVien.findById(id);
  if (!nhanVien) {
    throw new Error('Nhân viên không tồn tại');
  }

  // Xóa tài khoản người dùng liên kết trước
  await User.findByIdAndDelete(nhanVien.userId);

  // Sau đó xóa nhân viên
  await NhanVien.findByIdAndDelete(id);

  return { message: 'Xóa nhân viên và tài khoản thành công' };
};

module.exports = {
  getAllNhanVien,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
};
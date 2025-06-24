const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { NhanVien, User, NhaXe } = require('../models');

const getAllNhanVien = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const nhanViens = await NhanVien.find()
    .populate({
      path: 'userId',
      select: 'username',
    })
    .populate({
      path: 'nhaXeId',
      select: 'tenNhaXe',
    })
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await NhanVien.countDocuments();
  return { nhanViens, total, page, limit };
};

const createNhanVien = async (data) => {
  const { username, password, hoVaTen, sdt, chucVu, cccd, email, diaChi, ngaySinh, nhaXeId } = data;

  // Validate required fields
  if (!username || !password || !hoVaTen || !sdt || !chucVu || !cccd || !nhaXeId) {
    throw new Error('Thiếu thông tin bắt buộc');
  }

  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Tên đăng nhập đã tồn tại.');
  }

  // Check if CCCD already exists
  const existingCCCD = await NhanVien.findOne({ cccd });
  if (existingCCCD) {
    throw new Error('CCCD đã tồn tại.');
  }

  // Check if phone number already exists
  const existingPhone = await NhanVien.findOne({ sdt });
  if (existingPhone) {
    throw new Error('Số điện thoại đã tồn tại.');
  }

  // Validate nhaXeId exists
  const nhaXe = await NhaXe.findById(nhaXeId);
  if (!nhaXe) {
    throw new Error('Nhà xe không tồn tại.');
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
      cccd,
      hoVaTen,
      sdt,
      chucVu,
      email: email || '',
      diaChi: diaChi || '',
      ngaySinh: ngaySinh ? new Date(ngaySinh) : null,
      nhaXeId,
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
  const nhanVien = await NhanVien.findById(id);
  if (!nhanVien) {
    throw new Error('Nhân viên không tồn tại');
  }

  const { hoVaTen, sdt, chucVu, cccd, email, diaChi, ngaySinh, nhaXeId } = data;

  // Check if CCCD is being changed and already exists
  if (cccd && cccd !== nhanVien.cccd) {
    const existingCCCD = await NhanVien.findOne({ cccd });
    if (existingCCCD) {
      throw new Error('CCCD đã tồn tại.');
    }
  }

  // Check if phone number is being changed and already exists
  if (sdt && sdt !== nhanVien.sdt) {
    const existingPhone = await NhanVien.findOne({ sdt });
    if (existingPhone) {
      throw new Error('Số điện thoại đã tồn tại.');
    }
  }

  // Validate nhaXeId if being changed
  if (nhaXeId && nhaXeId !== nhanVien.nhaXeId.toString()) {
    const nhaXe = await NhaXe.findById(nhaXeId);
    if (!nhaXe) {
      throw new Error('Nhà xe không tồn tại.');
    }
  }

  // Update fields
  if (hoVaTen) nhanVien.hoVaTen = hoVaTen;
  if (sdt) nhanVien.sdt = sdt;
  if (chucVu) nhanVien.chucVu = chucVu;
  if (cccd) nhanVien.cccd = cccd;
  if (email !== undefined) nhanVien.email = email;
  if (diaChi !== undefined) nhanVien.diaChi = diaChi;
  if (ngaySinh !== undefined) nhanVien.ngaySinh = ngaySinh ? new Date(ngaySinh) : null;
  if (nhaXeId) nhanVien.nhaXeId = nhaXeId;

  return await nhanVien.save();
};

const deleteNhanVien = async (id) => {
  const nhanVien = await NhanVien.findById(id);
  if (!nhanVien) throw new Error('Nhân viên không tồn tại');

  // Delete associated user account
  if (nhanVien.userId) {
    await User.findByIdAndDelete(nhanVien.userId);
  }

  await NhanVien.findByIdAndDelete(id);
  return { message: 'Xóa nhân viên thành công' };
};

module.exports = {
  getAllNhanVien,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
};
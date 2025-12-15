const { KhachHang } = require('../models');

const getAllKhachHang = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const khachHangs = await KhachHang.find()
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await KhachHang.countDocuments();
  return { khachHangs, total, page, limit };
};

const createKhachHang = async (data) => {
  const { cccd, diaChi, email, hoVaTen, ngaySinh, sdt } = data;

  const existingCccd = await KhachHang.findOne({ cccd });
  if (existingCccd) throw new Error('CCCD đã tồn tại');

  const khachHang = new KhachHang({ cccd, diaChi, email, hoVaTen, ngaySinh, sdt });
  return await khachHang.save();
};

const updateKhachHang = async (id, data) => {
  const khachHang = await KhachHang.findById(id);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');

  const { cccd, diaChi, email, hoVaTen, ngaySinh, sdt } = data;

  // 1. Kiểm tra trùng CCCD (nếu có thay đổi)
  if (cccd && cccd !== khachHang.cccd) {
    const existingCccd = await KhachHang.findOne({ cccd });
    if (existingCccd) throw new Error('CCCD này đã được sử dụng bởi người khác.');
  }

  // 2. Kiểm tra trùng Email (BỔ SUNG QUAN TRỌNG)
  if (email && email !== khachHang.email) {
    const existingEmail = await KhachHang.findOne({ email });
    if (existingEmail) throw new Error('Email này đã được sử dụng bởi người khác.');
  }

  // 3. Kiểm tra trùng SĐT (BỔ SUNG QUAN TRỌNG)
  if (sdt && sdt !== khachHang.sdt) {
    const existingSdt = await KhachHang.findOne({ sdt });
    if (existingSdt) throw new Error('Số điện thoại này đã được sử dụng bởi người khác.');
  }

  // Cập nhật dữ liệu (chỉ cập nhật các trường có gửi lên)
  if (hoVaTen) khachHang.hoVaTen = hoVaTen;
  if (diaChi) khachHang.diaChi = diaChi;
  if (ngaySinh) khachHang.ngaySinh = new Date(ngaySinh);
  if (cccd) khachHang.cccd = cccd;
  if (email) khachHang.email = email;
  if (sdt) khachHang.sdt = sdt;

  return await khachHang.save();
};

const deleteKhachHang = async (id) => {
  const khachHang = await KhachHang.findById(id);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');
  await khachHang.deleteOne();
  return { message: 'Xóa khách hàng thành công' };
};

module.exports = {
  getAllKhachHang,
  createKhachHang,
  updateKhachHang,
  deleteKhachHang,
};
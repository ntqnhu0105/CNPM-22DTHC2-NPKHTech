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
  if (cccd && cccd !== khachHang.cccd) {
    const existingCccd = await KhachHang.findOne({ cccd });
    if (existingCccd) throw new Error('CCCD đã tồn tại');
  }

  Object.assign(khachHang, { cccd, diaChi, email, hoVaTen, ngaySinh, sdt });
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
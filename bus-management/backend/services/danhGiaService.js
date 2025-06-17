const { DanhGia, KhachHang, ChuyenXe, NhaXe } = require('../models');

const getAllDanhGia = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const danhGias = await DanhGia.find()
    .populate('khachHangId', 'hoVaTen')
    .populate('chuyenXeId', 'thoiGianKhoiHanh')
    .populate('nhaXeId', 'tenNhaXe')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await DanhGia.countDocuments();
  return { danhGias, total, page, limit };
};

const createDanhGia = async (data) => {
  const { khachHangId, chuyenXeId, nhaXeId, rating, comment, ngayDanhGia } = data;

  const khachHang = await KhachHang.findById(khachHangId);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');
  if (chuyenXeId) {
    const chuyenXe = await ChuyenXe.findById(chuyenXeId);
    if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');
  }
  const nhaXe = await NhaXe.findById(nhaXeId);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');

  const danhGia = new DanhGia({ khachHangId, chuyenXeId, nhaXeId, rating, comment, ngayDanhGia });
  return await danhGia.save();
};

const updateDanhGia = async (id, data) => {
  const danhGia = await DanhGia.findById(id);
  if (!danhGia) throw new Error('Đánh giá không tồn tại');

  const { khachHangId, chuyenXeId, nhaXeId, rating, comment, ngayDanhGia } = data;
  if (khachHangId) {
    const khachHang = await KhachHang.findById(khachHangId);
    if (!khachHang) throw new Error('Khách hàng không tồn tại');
  }
  if (chuyenXeId) {
    const chuyenXe = await ChuyenXe.findById(chuyenXeId);
    if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');
  }
  if (nhaXeId) {
    const nhaXe = await NhaXe.findById(nhaXeId);
    if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  }

  Object.assign(danhGia, { khachHangId, chuyenXeId, nhaXeId, rating, comment, ngayDanhGia });
  return await danhGia.save();
};

const deleteDanhGia = async (id) => {
  const danhGia = await DanhGia.findById(id);
  if (!danhGia) throw new Error('Đánh giá không tồn tại');
  await danhGia.deleteOne();
  return { message: 'Xóa đánh giá thành công' };
};

module.exports = {
  getAllDanhGia,
  createDanhGia,
  updateDanhGia,
  deleteDanhGia,
};
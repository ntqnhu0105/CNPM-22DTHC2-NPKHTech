const { ThongBao, KhachHang } = require('../models');

const getAllThongBao = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const thongBaos = await ThongBao.find()
    .populate('khachHangId', 'hoVaTen')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await ThongBao.countDocuments();
  return { thongBaos, total, page, limit };
};

const createThongBao = async (data) => {
  const { khachHangId, tieuDe, noiDung, ngayGui, trangThai } = data;

  const khachHang = await KhachHang.findById(khachHangId);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');

  const thongBao = new ThongBao({ khachHangId, tieuDe, noiDung, ngayGui, trangThai });
  return await thongBao.save();
};

const updateThongBao = async (id, data) => {
  const thongBao = await ThongBao.findById(id);
  if (!thongBao) throw new Error('Thông báo không tồn tại');

  const { khachHangId, tieuDe, noiDung, ngayGui, trangThai } = data;
  if (khachHangId) {
    const khachHang = await KhachHang.findById(khachHangId);
    if (!khachHang) throw new Error('Khách hàng không tồn tại');
  }

  Object.assign(thongBao, { khachHangId, tieuDe, noiDung, ngayGui, trangThai });
  return await thongBao.save();
};

const deleteThongBao = async (id) => {
  const thongBao = await ThongBao.findById(id);
  if (!thongBao) throw new Error('Thông báo không tồn tại');
  await thongBao.deleteOne();
  return { message: 'Xóa thông báo thành công' };
};

module.exports = {
  getAllThongBao,
  createThongBao,
  updateThongBao,
  deleteThongBao,
};
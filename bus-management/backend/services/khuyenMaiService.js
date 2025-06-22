const { KhuyenMai } = require('../models');

const getAllKhuyenMai = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const khuyenMais = await KhuyenMai.find()
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await KhuyenMai.countDocuments();
  return { khuyenMais, total, page, limit };
};

const createKhuyenMai = async (data) => {
  const { tenKhuyenMai, phanTramGiamGia, ngayBatDau, ngayKetThuc } = data;
  const khuyenMai = new KhuyenMai({
    tenKhuyenMai,
    phanTramGiamGia,
    ngayBatDau,
    ngayKetThuc,
  });
  return await khuyenMai.save();
};

const updateKhuyenMai = async (id, data) => {
  const khuyenMai = await KhuyenMai.findById(id);
  if (!khuyenMai) throw new Error('Khuyến mãi không tồn tại');

  Object.assign(khuyenMai, data);
  return await khuyenMai.save();
};

const deleteKhuyenMai = async (id) => {
  const khuyenMai = await KhuyenMai.findById(id);
  if (!khuyenMai) throw new Error('Khuyến mãi không tồn tại');
  await khuyenMai.deleteOne();
  return { message: 'Xóa khuyến mãi thành công' };
};

module.exports = {
  getAllKhuyenMai,
  createKhuyenMai,
  updateKhuyenMai,
  deleteKhuyenMai,
};
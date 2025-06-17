const { KhuyenMai, NhaXe } = require('../models');

const getAllKhuyenMai = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const khuyenMais = await KhuyenMai.find()
    .populate('nhaXeId', 'tenNhaXe')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await KhuyenMai.countDocuments();
  return { khuyenMais, total, page, limit };
};

const createKhuyenMai = async (data) => {
  const { nhaXeId, code, discount, validFrom, validTo, maxUsage } = data;

  const nhaXe = await NhaXe.findById(nhaXeId);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  const existingCode = await KhuyenMai.findOne({ code });
  if (existingCode) throw new Error('Mã khuyến mãi đã tồn tại');

  const khuyenMai = new KhuyenMai({ nhaXeId, code, discount, validFrom, validTo, maxUsage, usageCount: 0 });
  return await khuyenMai.save();
};

const updateKhuyenMai = async (id, data) => {
  const khuyenMai = await KhuyenMai.findById(id);
  if (!khuyenMai) throw new Error('Khuyến mãi không tồn tại');

  const { nhaXeId, code, discount, validFrom, validTo, maxUsage, usageCount } = data;
  if (nhaXeId) {
    const nhaXe = await NhaXe.findById(nhaXeId);
    if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  }
  if (code && code !== khuyenMai.code) {
    const existingCode = await KhuyenMai.findOne({ code });
    if (existingCode) throw new Error('Mã khuyến mãi đã tồn tại');
  }

  Object.assign(khuyenMai, { nhaXeId, code, discount, validFrom, validTo, maxUsage, usageCount });
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
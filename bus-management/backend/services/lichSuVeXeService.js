const { LichSuVeXe, VeXe } = require('../models');

const getAllLichSuVeXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const lichSuVeXes = await LichSuVeXe.find()
    .populate('veXeId', 'maSoGhe')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await LichSuVeXe.countDocuments();
  return { lichSuVeXes, total, page, limit };
};

const createLichSuVeXe = async (data) => {
  const { veXeId, trangThai, ngayThayDoi, ghiChu } = data;

  const veXe = await VeXe.findById(veXeId);
  if (!veXe) throw new Error('Vé xe không tồn tại');

  const lichSuVeXe = new LichSuVeXe({ veXeId, trangThai, ngayThayDoi, ghiChu });
  return await lichSuVeXe.save();
};

const updateLichSuVeXe = async (id, data) => {
  const lichSuVeXe = await LichSuVeXe.findById(id);
  if (!lichSuVeXe) throw new Error('Lịch sử vé xe không tồn tại');

  const { veXeId, trangThai, ngayThayDoi, ghiChu } = data;
  if (veXeId) {
    const veXe = await VeXe.findById(veXeId);
    if (!veXe) throw new Error('Vé xe không tồn tại');
  }

  Object.assign(lichSuVeXe, { veXeId, trangThai, ngayThayDoi, ghiChu });
  return await lichSuVeXe.save();
};

const deleteLichSuVeXe = async (id) => {
  const lichSuVeXe = await LichSuVeXe.findById(id);
  if (!lichSuVeXe) throw new Error('Lịch sử vé xe không tồn tại');
  await lichSuVeXe.deleteOne();
  return { message: 'Xóa lịch sử vé xe thành công' };
};

module.exports = {
  getAllLichSuVeXe,
  createLichSuVeXe,
  updateLichSuVeXe,
  deleteLichSuVeXe,
};
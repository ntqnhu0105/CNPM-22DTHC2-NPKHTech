const { ChuyenXe, Xe, TaiXe, TuyenXe } = require('../models');

const getAllChuyenXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const chuyenXes = await ChuyenXe.find()
    .populate('tuyenXeId', 'diemDi diemDen')
    .populate('xeId', 'bienSoXe')
    .populate('taiXeId', 'hoVaTen')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await ChuyenXe.countDocuments();
  return { chuyenXes, total, page, limit };
};

const createChuyenXe = async (data) => {
  const { tuyenXeId, xeId, taiXeId, gia, thoiGianKhoiHanh } = data;

  const tuyenXe = await TuyenXe.findById(tuyenXeId);
  if (!tuyenXe) throw new Error('Tuyến xe không tồn tại');
  const xe = await Xe.findById(xeId);
  if (!xe) throw new Error('Xe không tồn tại');
  const taiXe = await TaiXe.findById(taiXeId);
  if (!taiXe) throw new Error('Tài xế không tồn tại');

  const conflictingChuyenXe = await ChuyenXe.findOne({
    xeId,
    thoiGianKhoiHanh: { $gte: new Date(thoiGianKhoiHanh), $lte: new Date(thoiGianKhoiHanh).setHours(23, 59, 59) },
  });
  if (conflictingChuyenXe) throw new Error('Xe đã được xếp lịch vào thời gian này');

  const chuyenXe = new ChuyenXe({ tuyenXeId, xeId, taiXeId, gia, thoiGianKhoiHanh, trangThaiChuyen: 'Pending' });
  return await chuyenXe.save();
};

const updateChuyenXe = async (id, data) => {
  const chuyenXe = await ChuyenXe.findById(id);
  if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');

  const { tuyenXeId, xeId, taiXeId, gia, thoiGianKhoiHanh, trangThaiChuyen } = data;
  if (tuyenXeId) {
    const tuyenXe = await TuyenXe.findById(tuyenXeId);
    if (!tuyenXe) throw new Error('Tuyến xe không tồn tại');
  }
  if (xeId) {
    const xe = await Xe.findById(xeId);
    if (!xe) throw new Error('Xe không tồn tại');
  }
  if (taiXeId) {
    const taiXe = await TaiXe.findById(taiXeId);
    if (!taiXe) throw new Error('Tài xế không tồn tại');
  }
  if (xeId && thoiGianKhoiHanh) {
    const conflictingChuyenXe = await ChuyenXe.findOne({
      _id: { $ne: id },
      xeId,
      thoiGianKhoiHanh: { $gte: new Date(thoiGianKhoiHanh), $lte: new Date(thoiGianKhoiHanh).setHours(23, 59, 59) },
    });
    if (conflictingChuyenXe) throw new Error('Xe đã được xếp lịch vào thời gian này');
  }

  Object.assign(chuyenXe, { tuyenXeId, xeId, taiXeId, gia, thoiGianKhoiHanh, trangThaiChuyen });
  return await chuyenXe.save();
};

const deleteChuyenXe = async (id) => {
  const chuyenXe = await ChuyenXe.findById(id);
  if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');
  await chuyenXe.deleteOne();
  return { message: 'Xóa chuyến xe thành công' };
};

module.exports = {
  getAllChuyenXe,
  createChuyenXe,
  updateChuyenXe,
  deleteChuyenXe,
};
const { Xe, NhaXe, LoaiXe } = require('../models');

const getAllXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const xes = await Xe.find()
    .populate('nhaXeId', 'tenNhaXe')
    .populate('loaiXeId', 'tenLoai')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await Xe.countDocuments();
  return { xes, total, page, limit };
};

const createXe = async (data) => {
  const { bienSoXe, nhaXeId, loaiXeId, soGhe, trangThai } = data;

  const nhaXe = await NhaXe.findById(nhaXeId);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  const loaiXe = await LoaiXe.findById(loaiXeId);
  if (!loaiXe) throw new Error('Loại xe không tồn tại');
  const existingXe = await Xe.findOne({ bienSoXe });
  if (existingXe) throw new Error('Biển số xe đã tồn tại');

  const xe = new Xe({ bienSoXe, nhaXeId, loaiXeId, soGhe, trangThai });
  return await xe.save();
};

const updateXe = async (id, data) => {
  const xe = await Xe.findById(id);
  if (!xe) throw new Error('Xe không tồn tại');

  const { bienSoXe, nhaXeId, loaiXeId, soGhe, trangThai } = data;
  if (nhaXeId) {
    const nhaXe = await NhaXe.findById(nhaXeId);
    if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  }
  if (loaiXeId) {
    const loaiXe = await LoaiXe.findById(loaiXeId);
    if (!loaiXe) throw new Error('Loại xe không tồn tại');
  }
  if (bienSoXe && bienSoXe !== xe.bienSoXe) {
    const existingXe = await Xe.findOne({ bienSoXe });
    if (existingXe) throw new Error('Biển số xe đã tồn tại');
  }

  Object.assign(xe, { bienSoXe, nhaXeId, loaiXeId, soGhe, trangThai });
  return await xe.save();
};

const deleteXe = async (id) => {
  const xe = await Xe.findById(id);
  if (!xe) throw new Error('Xe không tồn tại');
  await xe.deleteOne();
  return { message: 'Xóa xe thành công' };
};

module.exports = {
  getAllXe,
  createXe,
  updateXe,
  deleteXe,
};
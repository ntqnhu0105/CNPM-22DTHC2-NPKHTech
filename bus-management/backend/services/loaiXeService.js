const { LoaiXe } = require('../models');

const getAllLoaiXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const loaiXes = await LoaiXe.find()
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await LoaiXe.countDocuments();
  return { loaiXes, total, page, limit };
};

const createLoaiXe = async (data) => {
  const { tenLoai, moTa } = data;

  const existingLoaiXe = await LoaiXe.findOne({ tenLoai });
  if (existingLoaiXe) throw new Error('Loại xe đã tồn tại');

  const loaiXe = new LoaiXe({ tenLoai, moTa });
  return await loaiXe.save();
};

const updateLoaiXe = async (id, data) => {
  const loaiXe = await LoaiXe.findById(id);
  if (!loaiXe) throw new Error('Loại xe không tồn tại');

  const { tenLoai, moTa } = data;
  if (tenLoai && tenLoai !== loaiXe.tenLoai) {
    const existingLoaiXe = await LoaiXe.findOne({ tenLoai });
    if (existingLoaiXe) throw new Error('Loại xe đã tồn tại');
  }

  Object.assign(loaiXe, { tenLoai, moTa });
  return await loaiXe.save();
};

const deleteLoaiXe = async (id) => {
  const loaiXe = await LoaiXe.findById(id);
  if (!loaiXe) throw new Error('Loại xe không tồn tại');
  await loaiXe.deleteOne();
  return { message: 'Xóa loại xe thành công' };
};

module.exports = {
  getAllLoaiXe,
  createLoaiXe,
  updateLoaiXe,
  deleteLoaiXe,
};
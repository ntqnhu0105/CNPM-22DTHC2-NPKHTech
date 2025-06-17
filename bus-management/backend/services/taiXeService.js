const { TaiXe } = require('../models');

const getAllTaiXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const taiXes = await TaiXe.find()
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await TaiXe.countDocuments();
  return { taiXes, total, page, limit };
};

const createTaiXe = async (data) => {
  const { bangLai, cccd, hoVaTen, kinhNghiem, ngaySinh, sdt } = data;

  const existingCccd = await TaiXe.findOne({ cccd });
  if (existingCccd) throw new Error('CCCD đã tồn tại');

  const taiXe = new TaiXe({ bangLai, cccd, hoVaTen, kinhNghiem, ngaySinh, sdt });
  return await taiXe.save();
};

const updateTaiXe = async (id, data) => {
  const taiXe = await TaiXe.findById(id);
  if (!taiXe) throw new Error('Tài xế không tồn tại');

  const { bangLai, cccd, hoVaTen, kinhNghiem, ngaySinh, sdt } = data;
  if (cccd && cccd !== taiXe.cccd) {
    const existingCccd = await TaiXe.findOne({ cccd });
    if (existingCccd) throw new Error('CCCD đã tồn tại');
  }

  Object.assign(taiXe, { bangLai, cccd, hoVaTen, kinhNghiem, ngaySinh, sdt });
  return await taiXe.save();
};

const deleteTaiXe = async (id) => {
  const taiXe = await TaiXe.findById(id);
  if (!taiXe) throw new Error('Tài xế không tồn tại');
  await taiXe.deleteOne();
  return { message: 'Xóa tài xế thành công' };
};

module.exports = {
  getAllTaiXe,
  createTaiXe,
  updateTaiXe,
  deleteTaiXe,
};
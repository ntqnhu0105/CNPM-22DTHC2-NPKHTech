const { SoGheSoGiuong, Xe } = require('../models');

const getAllSoGheSoGiuong = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const soGheSoGiuongs = await SoGheSoGiuong.find()
    .populate('xeId', 'bienSoXe')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await SoGheSoGiuong.countDocuments();
  return { soGheSoGiuongs, total, page, limit };
};

const createSoGheSoGiuong = async (data) => {
  const { maSoGhe, xeId, trangThai } = data;

  const xe = await Xe.findById(xeId);
  if (!xe) throw new Error('Xe không tồn tại');
  const existingSoGhe = await SoGheSoGiuong.findOne({ maSoGhe, xeId });
  if (existingSoGhe) throw new Error('Mã số ghế đã tồn tại trên xe này');

  const soGheSoGiuong = new SoGheSoGiuong({ maSoGhe, xeId, trangThai });
  return await soGheSoGiuong.save();
};

const updateSoGheSoGiuong = async (id, data) => {
  const soGheSoGiuong = await SoGheSoGiuong.findById(id);
  if (!soGheSoGiuong) throw new Error('Số ghế/số giường không tồn tại');

  const { maSoGhe, xeId, trangThai } = data;
  if (xeId) {
    const xe = await Xe.findById(xeId);
    if (!xe) throw new Error('Xe không tồn tại');
  }
  if (maSoGhe && (maSoGhe !== soGheSoGiuong.maSoGhe || xeId !== soGheSoGiuong.xeId.toString())) {
    const existingSoGhe = await SoGheSoGiuong.findOne({ maSoGhe, xeId: xeId || soGheSoGiuong.xeId });
    if (existingSoGhe) throw new Error('Mã số ghế đã tồn tại trên xe này');
  }

  Object.assign(soGheSoGiuong, { maSoGhe, xeId, trangThai });
  return await soGheSoGiuong.save();
};

const deleteSoGheSoGiuong = async (id) => {
  const soGheSoGiuong = await SoGheSoGiuong.findById(id);
  if (!soGheSoGiuong) throw new Error('Số ghế/số giường không tồn tại');
  await soGheSoGiuong.deleteOne();
  return { message: 'Xóa số ghế/số giường thành công' };
};

module.exports = {
  getAllSoGheSoGiuong,
  createSoGheSoGiuong,
  updateSoGheSoGiuong,
  deleteSoGheSoGiuong,
};
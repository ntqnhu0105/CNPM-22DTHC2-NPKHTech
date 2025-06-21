const { SoGheSoGiuong, Xe } = require('../models');

const getAllSoGheSoGiuong = async ({ page = 1, limit = 10, xeId }) => {
  const skip = (page - 1) * limit;
  const query = xeId ? { xeId } : {};
  const soGheSoGiuongs = await SoGheSoGiuong.find(query)
    .populate('xeId', 'bienSoXe soGhe')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await SoGheSoGiuong.countDocuments(query);
  return { soGheSoGiuongs, total, page, limit };
};

const createSoGheSoGiuong = async (data) => {
  const { maSoGhe, xeId, trangThai } = data;
  const xe = await Xe.findById(xeId);
  if (!xe) throw new Error('Xe không tồn tại');
  const existingSeat = await SoGheSoGiuong.findOne({ maSoGhe, xeId });
  if (existingSeat) throw new Error('Mã số ghế/giường đã tồn tại cho xe này');
  const soGheSoGiuong = new SoGheSoGiuong({ maSoGhe, xeId, trangThai });
  return await soGheSoGiuong.save();
};

const bulkCreateSoGheSoGiuong = async ({ xeId, soGhe, force = false }) => {
  const xe = await Xe.findById(xeId);
  if (!xe) throw new Error('Xe không tồn tại');
  if (soGhe > xe.soGhe) throw new Error(`Số ghế/giường không được vượt quá ${xe.soGhe}`);

  if (force) {
    await SoGheSoGiuong.deleteMany({ xeId });
  } else {
    const existingSeats = await SoGheSoGiuong.countDocuments({ xeId });
    if (existingSeats > 0) throw new Error('Xe đã có ghế/giường, sử dụng force=true để xóa và tạo mới');
  }

  const seats = [];
  const rows = Math.ceil(soGhe / 4);
  for (let i = 0; i < rows; i++) {
    ['A', 'B', 'C', 'D'].forEach((col, index) => {
      if (seats.length < soGhe) {
        seats.push({
          maSoGhe: `${col}${i + 1}`,
          xeId,
          trangThai: 'Available',
        });
      }
    });
  }

  return await SoGheSoGiuong.insertMany(seats);
};

const updateSoGheSoGiuong = async (id, data) => {
  const soGheSoGiuong = await SoGheSoGiuong.findById(id);
  if (!soGheSoGiuong) throw new Error('Số ghế/số giường không tồn tại');

  const { maSoGhe, xeId, trangThai } = data;
  if (xeId) {
    const xe = await Xe.findById(xeId);
    if (!xe) throw new Error('Xe không tồn tại');
  }
  if (maSoGhe && maSoGhe !== soGheSoGiuong.maSoGhe) {
    const existingSeat = await SoGheSoGiuong.findOne({ maSoGhe, xeId: xeId || soGheSoGiuong.xeId });
    if (existingSeat) throw new Error('Mã số ghế/giường đã tồn tại cho xe này');
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

const deleteAllSoGheSoGiuongByXeId = async (xeId) => {
  const xe = await Xe.findById(xeId);
  if (!xe) throw new Error('Xe không tồn tại');
  const deleted = await SoGheSoGiuong.deleteMany({ xeId });
  return { message: `Xóa ${deleted.deletedCount} số ghế/số giường thành công` };
};

module.exports = {
  getAllSoGheSoGiuong,
  createSoGheSoGiuong,
  bulkCreateSoGheSoGiuong,
  updateSoGheSoGiuong,
  deleteSoGheSoGiuong,
  deleteAllSoGheSoGiuongByXeId,
};
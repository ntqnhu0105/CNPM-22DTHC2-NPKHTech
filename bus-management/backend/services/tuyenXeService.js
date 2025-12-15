const { TuyenXe } = require('../models');

const getAllTuyenXe = async ({ page = 1, limit = 10, search }) => { 
  const skip = (page - 1) * limit;
  
  let query = {};
  if (search) {
    query = {
      $or: [
        { diemDi: { $regex: search, $options: 'i' } }, 
        { diemDen: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const tuyenXes = await TuyenXe.find(query)
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await TuyenXe.countDocuments(query);
  return { tuyenXes, total, page, limit };
};

const createTuyenXe = async (data) => {
  const { diemDi, diemDen, khoangCach, thoiGianDuKien, moTa } = data;

  const tuyenXe = new TuyenXe({ diemDi, diemDen, khoangCach, thoiGianDuKien, moTa });
  return await tuyenXe.save();
};

const updateTuyenXe = async (id, data) => {
  const tuyenXe = await TuyenXe.findById(id);
  if (!tuyenXe) throw new Error('Tuyến xe không tồn tại');

  const { diemDi, diemDen, khoangCach, thoiGianDuKien, moTa } = data;
  Object.assign(tuyenXe, { diemDi, diemDen, khoangCach, thoiGianDuKien, moTa });
  return await tuyenXe.save();
};

const deleteTuyenXe = async (id) => {
  const tuyenXe = await TuyenXe.findById(id);
  if (!tuyenXe) throw new Error('Tuyến xe không tồn tại');
  await tuyenXe.deleteOne();
  return { message: 'Xóa tuyến xe thành công' };
};

module.exports = {
  getAllTuyenXe,
  createTuyenXe,
  updateTuyenXe,
  deleteTuyenXe,
};
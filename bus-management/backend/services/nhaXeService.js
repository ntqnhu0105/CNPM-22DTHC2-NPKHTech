const { NhaXe } = require('../models');

const getAllNhaXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const nhaXes = await NhaXe.find()
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await NhaXe.countDocuments();
  return { nhaXes, total, page, limit };
};

const createNhaXe = async (data) => {
  const { diaChi, email, sdt, tenNhaXe } = data;

  const existingEmail = await NhaXe.findOne({ email });
  if (existingEmail) throw new Error('Email đã tồn tại');

  const nhaXe = new NhaXe({ diaChi, email, sdt, tenNhaXe });
  return await nhaXe.save();
};

const updateNhaXe = async (id, data) => {
  const nhaXe = await NhaXe.findById(id);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');

  const { diaChi, email, sdt, tenNhaXe } = data;
  if (email && email !== nhaXe.email) {
    const existingEmail = await NhaXe.findOne({ email });
    if (existingEmail) throw new Error('Email đã tồn tại');
  }

  Object.assign(nhaXe, { diaChi, email, sdt, tenNhaXe });
  return await nhaXe.save();
};

const deleteNhaXe = async (id) => {
  const nhaXe = await NhaXe.findById(id);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  await nhaXe.deleteOne();
  return { message: 'Xóa nhà xe thành công' };
};

module.exports = {
  getAllNhaXe,
  createNhaXe,
  updateNhaXe,
  deleteNhaXe,
};
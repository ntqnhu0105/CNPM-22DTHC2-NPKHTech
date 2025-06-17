const { NhanVien, NhaXe } = require('../models');

const getAllNhanVien = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const nhanViens = await NhanVien.find()
    .populate('nhaXeId', 'tenNhaXe')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await NhanVien.countDocuments();
  return { nhanViens, total, page, limit };
};

const createNhanVien = async (data) => {
  const { cccd, diaChi, email, hoVaTen, nhaXeId, ngaySinh, sdt } = data;

  const nhaXe = await NhaXe.findById(nhaXeId);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  const existingCccd = await NhanVien.findOne({ cccd });
  if (existingCccd) throw new Error('CCCD đã tồn tại');

  const nhanVien = new NhanVien({ cccd, diaChi, email, hoVaTen, nhaXeId, ngaySinh, sdt });
  return await nhanVien.save();
};

const updateNhanVien = async (id, data) => {
  const nhanVien = await NhanVien.findById(id);
  if (!nhanVien) throw new Error('Nhân viên không tồn tại');

  const { cccd, diaChi, email, hoVaTen, nhaXeId, ngaySinh, sdt } = data;
  if (nhaXeId) {
    const nhaXe = await NhaXe.findById(nhaXeId);
    if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  }
  if (cccd && cccd !== nhanVien.cccd) {
    const existingCccd = await NhanVien.findOne({ cccd });
    if (existingCccd) throw new Error('CCCD đã tồn tại');
  }

  Object.assign(nhanVien, { cccd, diaChi, email, hoVaTen, nhaXeId, ngaySinh, sdt });
  return await nhanVien.save();
};

const deleteNhanVien = async (id) => {
  const nhanVien = await NhanVien.findById(id);
  if (!nhanVien) throw new Error('Nhân viên không tồn tại');
  await nhanVien.deleteOne();
  return { message: 'Xóa nhân viên thành công' };
};

module.exports = {
  getAllNhanVien,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
};
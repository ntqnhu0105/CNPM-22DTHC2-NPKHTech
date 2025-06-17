const { CSKH, KhachHang, NhaXe } = require('../models');

const getAllCSKH = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const cskhs = await CSKH.find()
    .populate('khachHangId', 'hoVaTen')
    .populate('nhaXeId', 'tenNhaXe')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await CSKH.countDocuments();
  return { cskhs, total, page, limit };
};

const createCSKH = async (data) => {
  const { khachHangId, nhaXeId, moTa, ngayCSKH } = data;

  const khachHang = await KhachHang.findById(khachHangId);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');
  const nhaXe = await NhaXe.findById(nhaXeId);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');

  const cskh = new CSKH({ khachHangId, nhaXeId, moTa, ngayCSKH });
  return await cskh.save();
};

const updateCSKH = async (id, data) => {
  const cskh = await CSKH.findById(id);
  if (!cskh) throw new Error('CSKH không tồn tại');

  const { khachHangId, nhaXeId, moTa, ngayCSKH } = data;
  if (khachHangId) {
    const khachHang = await KhachHang.findById(khachHangId);
    if (!khachHang) throw new Error('Khách hàng không tồn tại');
  }
  if (nhaXeId) {
    const nhaXe = await NhaXe.findById(nhaXeId);
    if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  }

  Object.assign(cskh, { khachHangId, nhaXeId, moTa, ngayCSKH });
  return await cskh.save();
};

const deleteCSKH = async (id) => {
  const cskh = await CSKH.findById(id);
  if (!cskh) throw new Error('CSKH không tồn tại');
  await cskh.deleteOne();
  return { message: 'Xóa CSKH thành công' };
};

module.exports = {
  getAllCSKH,
  createCSKH,
  updateCSKH,
  deleteCSKH,
};
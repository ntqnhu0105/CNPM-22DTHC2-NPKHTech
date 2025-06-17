const { ThanhToan, KhachHang, NhaXe, VeXe } = require('../models');

const getAllThanhToan = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const thanhToans = await ThanhToan.find()
    .populate('khachHangId', 'hoVaTen')
    .populate('nhaXeId', 'tenNhaXe')
    .populate('veXeId', 'maSoGhe')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await ThanhToan.countDocuments();
  return { thanhToans, total, page, limit };
};

const createThanhToan = async (data) => {
  const { khachHangId, nhaXeId, veXeId, phuongThucThanhToan, soTien, trangThai, thoiGianGiaoDich, paymentGatewayId } = data;

  const khachHang = await KhachHang.findById(khachHangId);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');
  const nhaXe = await NhaXe.findById(nhaXeId);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  const veXe = await VeXe.findById(veXeId);
  if (!veXe) throw new Error('Vé xe không tồn tại');

  const thanhToan = new ThanhToan({ khachHangId, nhaXeId, veXeId, phuongThucThanhToan, soTien, trangThai, thoiGianGiaoDich, paymentGatewayId });
  return await thanhToan.save();
};

const updateThanhToan = async (id, data) => {
  const thanhToan = await ThanhToan.findById(id);
  if (!thanhToan) throw new Error('Thanh toán không tồn tại');

  const { khachHangId, nhaXeId, veXeId, phuongThucThanhToan, soTien, trangThai, thoiGianGiaoDich, paymentGatewayId } = data;
  if (khachHangId) {
    const khachHang = await KhachHang.findById(khachHangId);
    if (!khachHang) throw new Error('Khách hàng không tồn tại');
  }
  if (nhaXeId) {
    const nhaXe = await NhaXe.findById(nhaXeId);
    if (!nhaXe) throw new Error('Nhà xe không tồn tại');
  }
  if (veXeId) {
    const veXe = await VeXe.findById(veXeId);
    if (!veXe) throw new Error('Vé xe không tồn tại');
  }

  Object.assign(thanhToan, { khachHangId, nhaXeId, veXeId, phuongThucThanhToan, soTien, trangThai, thoiGianGiaoDich, paymentGatewayId });
  return await thanhToan.save();
};

const deleteThanhToan = async (id) => {
  const thanhToan = await ThanhToan.findById(id);
  if (!thanhToan) throw new Error('Thanh toán không tồn tại');
  await thanhToan.deleteOne();
  return { message: 'Xóa thanh toán thành công' };
};

module.exports = {
  getAllThanhToan,
  createThanhToan,
  updateThanhToan,
  deleteThanhToan,
};
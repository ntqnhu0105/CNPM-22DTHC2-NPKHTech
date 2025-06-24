const { ThanhToan, KhachHang, NhaXe, VeXe, LichSuVeXe, ThongBao } = require('../models');

const getAllThanhToan = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const thanhToans = await ThanhToan.find()
    .populate('khachHangId', 'hoVaTen')
    .populate('nhaXeId', 'tenNhaXe')
    .populate({
      path: 'veXeId',
      populate: [
        { path: 'khachHangId', select: 'hoVaTen' },
        { path: 'chuyenXeId', populate: { path: 'tuyenXeId', select: 'diemDi diemDen' } },
        { path: 'xeId', select: 'bienSoXe' },
        { path: 'khuyenMaiId', select: 'tenKhuyenMai phanTramGiamGia' }
      ]
    })
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await ThanhToan.countDocuments();
  return { thanhToans, total, page, limit };
};

const createThanhToan = async (data) => {
  const { veXeId, phuongThucThanhToan, soTien, trangThai, thoiGianGiaoDich, paymentGatewayId, diaChiDon, diaChiTra, thongTinKhachHang } = data;

  // Lấy thông tin vé xe và kiểm tra
  const veXe = await VeXe.findById(veXeId)
    .populate('khachHangId')
    .populate('xeId')
    .populate('chuyenXeId');
  
  if (!veXe) throw new Error('Vé xe không tồn tại');
  if (veXe.trangThai !== 'Booked') throw new Error('Vé xe phải có trạng thái Booked để thanh toán');

  const khachHangId = veXe.khachHangId._id;
  const nhaXeId = veXe.xeId.nhaXeId;

  // Kiểm tra khách hàng và nhà xe
  const khachHang = await KhachHang.findById(khachHangId);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');
  
  const nhaXe = await NhaXe.findById(nhaXeId);
  if (!nhaXe) throw new Error('Nhà xe không tồn tại');

  // Tạo thanh toán
  const thanhToan = new ThanhToan({ 
    khachHangId, 
    nhaXeId, 
    veXeId, 
    phuongThucThanhToan, 
    soTien, 
    trangThai, 
    thoiGianGiaoDich, 
    paymentGatewayId,
    diaChiDon,
    diaChiTra,
    thongTinKhachHang
  });
  
  const savedThanhToan = await thanhToan.save();

  // Cập nhật trạng thái vé sang 'Paid'
  veXe.trangThai = 'Paid';
  await veXe.save();

  // Lưu lịch sử vé
  const lichSuVeXe = new LichSuVeXe({
    veXeId: veXeId,
    trangThai: 'Paid',
    ngayThayDoi: new Date(),
    ghiChu: `Thanh toán thành công - ${phuongThucThanhToan} - ${soTien.toLocaleString('vi-VN')} VNĐ`
  });
  await lichSuVeXe.save();

  // Gửi thông báo cho khách hàng
  const thongBao = new ThongBao({
    tieuDe: 'Thanh toán thành công',
    noiDung: `Vé xe ${veXe.maSoGhe} của bạn đã được thanh toán thành công với số tiền ${soTien.toLocaleString('vi-VN')} VNĐ. Chúc bạn có chuyến đi vui vẻ!`,
    khachHangId: khachHangId,
    trangThai: 'Sent',
    ngayGui: new Date()
  });
  await thongBao.save();

  return savedThanhToan;
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
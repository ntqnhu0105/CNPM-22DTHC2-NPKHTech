const mongoose = require('mongoose');
const { VeXe, NhanVien, ChuyenXe, KhachHang, Xe, SoGheSoGiuong, KhuyenMai, LichSuVeXe } = require('../models');

const getAllVeXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const veXes = await VeXe.find({ trangThai: { $ne: 'Deleted' } })
    .populate('nhanVienId', 'hoVaTen')
    .populate({
      path: 'chuyenXeId',
      populate: { path: 'tuyenXeId', select: 'diemDi diemDen' }
    })
    .populate('khachHangId', 'hoVaTen')
    .populate('xeId', 'bienSoXe')
    .populate('khuyenMaiId', 'tenKhuyenMai phanTramGiamGia')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await VeXe.countDocuments({ trangThai: { $ne: 'Deleted' } });
  return { veXes, total, page, limit };
};

const createVeXe = async (data) => {
  const {
    chuyenXeId, khachHangId, maSoGhe, xeId, khuyenMaiId, phuongThucThanhToan, diaChiDon, diaChiTra, thongTinKhachHang
  } = data;

  // Validate các trường cần thiết
  const chuyenXe = await ChuyenXe.findById(chuyenXeId);
  if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');
  const khachHang = await KhachHang.findById(khachHangId);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');
  const xe = await Xe.findById(xeId);
  if (!xe) throw new Error('Xe không tồn tại');
  if (khuyenMaiId) {
    const khuyenMai = await KhuyenMai.findById(khuyenMaiId);
    if (!khuyenMai) throw new Error('Khuyến mãi không tồn tại');
  }
  const existingVeXe = await VeXe.findOne({ maSoGhe, xeId, chuyenXeId });
  if (existingVeXe) throw new Error('Ghế này đã được đặt');

  // Tính tổng tiền (giả lập, có thể lấy từ chuyenXe.gia)
  let tongTien = chuyenXe.gia;
  if (khuyenMaiId) {
    const khuyenMai = await KhuyenMai.findById(khuyenMaiId);
    tongTien = tongTien * (1 - (khuyenMai.discount || 0));
  }

  const veXe = new VeXe({
    nhanVienId: null,
    chuyenXeId,
    khachHangId,
    maSoGhe,
    xeId,
    ngayDatVe: new Date(),
    khuyenMaiId: khuyenMaiId || null,
    tongTien,
    trangThai: 'Booked',
    phuongThucThanhToan,
    diaChiDon,
    diaChiTra,
    thongTinKhachHang
  });
  await veXe.save();

  // Lưu lịch sử vé
  await new LichSuVeXe({
    veXeId: veXe._id,
    trangThai: 'Booked',
    ngayThayDoi: new Date(),
    ghiChu: 'Vé được đặt bởi khách hàng',
  }).save();

  return veXe;
};

const createVeXeAdmin = async (data) => {
  const {
    nhanVienId, chuyenXeId, khachHangId, maSoGhe, xeId, ngayDatVe, khuyenMaiId, tongTien, trangThai
  } = data;

  // Validate các trường cần thiết
  const chuyenXe = await ChuyenXe.findById(chuyenXeId);
  if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');
  const khachHang = await KhachHang.findById(khachHangId);
  if (!khachHang) throw new Error('Khách hàng không tồn tại');
  const xe = await Xe.findById(xeId);
  if (!xe) throw new Error('Xe không tồn tại');
  if (nhanVienId) {
    const nhanVien = await NhanVien.findById(nhanVienId);
    if (!nhanVien) throw new Error('Nhân viên không tồn tại');
  }
  if (khuyenMaiId) {
    const khuyenMai = await KhuyenMai.findById(khuyenMaiId);
    if (!khuyenMai) throw new Error('Khuyến mãi không tồn tại');
  }
  
  // Kiểm tra ghế đã được đặt chưa
  const existingVeXe = await VeXe.findOne({ 
    maSoGhe, 
    xeId, 
    chuyenXeId,
    trangThai: { $ne: 'Deleted' }
  });
  if (existingVeXe) throw new Error('Ghế này đã được đặt');

  const veXe = new VeXe({
    nhanVienId: nhanVienId || null,
    chuyenXeId,
    khachHangId,
    maSoGhe,
    xeId,
    ngayDatVe: ngayDatVe ? new Date(ngayDatVe) : new Date(),
    khuyenMaiId: khuyenMaiId || null,
    tongTien,
    trangThai: trangThai || 'Booked',
  });
  await veXe.save();

  // Lưu lịch sử vé
  await new LichSuVeXe({
    veXeId: veXe._id,
    trangThai: trangThai || 'Booked',
    ngayThayDoi: new Date(),
    ghiChu: 'Vé được tạo bởi admin',
  }).save();

  return veXe;
};

const updateVeXe = async (id, data) => {
  const veXe = await VeXe.findById(id);
  if (!veXe) throw new Error('Vé xe không tồn tại');

  const { nhanVienId, chuyenXeId, khachHangId, maSoGhe, xeId, ngayDatVe, khuyenMaiId, tongTien, trangThai } = data;
  if (nhanVienId) {
    const nhanVien = await NhanVien.findById(nhanVienId);
    if (!nhanVien) throw new Error('Nhân viên không tồn tại');
  }
  if (chuyenXeId) {
    const chuyenXe = await ChuyenXe.findById(chuyenXeId);
    if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');
  }
  if (khachHangId) {
    const khachHang = await KhachHang.findById(khachHangId);
    if (!khachHang) throw new Error('Khách hàng không tồn tại');
  }
  if (xeId) {
    const xe = await Xe.findById(xeId);
    if (!xe) throw new Error('Xe không tồn tại');
  }
  if (khuyenMaiId) {
    const khuyenMai = await KhuyenMai.findById(khuyenMaiId);
    if (!khuyenMai) throw new Error('Khuyến mãi không tồn tại');
  }
  if (maSoGhe && (maSoGhe !== veXe.maSoGhe || xeId !== veXe.xeId.toString() || chuyenXeId !== veXe.chuyenXeId.toString())) {
    const existingVeXe = await VeXe.findOne({ maSoGhe, xeId: xeId || veXe.xeId, chuyenXeId: chuyenXeId || veXe.chuyenXeId });
    if (existingVeXe) throw new Error('Ghế này đã được đặt');
  }

  Object.assign(veXe, { nhanVienId, chuyenXeId, khachHangId, maSoGhe, xeId, ngayDatVe, khuyenMaiId, tongTien, trangThai });
  return await veXe.save();
};

const deleteVeXe = async (id) => {
  const veXe = await VeXe.findById(id);
  if (!veXe) throw new Error('Vé xe không tồn tại');
  veXe.trangThai = 'Deleted';
  await veXe.save();
  await new LichSuVeXe({
    veXeId: veXe._id,
    trangThai: 'Deleted',
    ngayThayDoi: new Date(),
    ghiChu: 'Admin xóa vé'
  }).save();
  return { message: 'Đã đánh dấu vé là Deleted' };
};

const bookVeXeService = async ({ chuyenXeId, maSoGhe, khachHangId, khuyenMaiId }) => {
  try {
    // Validate customer
    const khachHang = await KhachHang.findById(khachHangId);
    if (!khachHang) throw new Error('Khách hàng không tồn tại');

    // Validate trip
    const chuyenXe = await ChuyenXe.findById(chuyenXeId).populate('xeId');
    if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');
    if (!['Pending', 'Running'].includes(chuyenXe.trangThaiChuyen)) {
      throw new Error('Chuyến xe không khả dụng để đặt vé');
    }

    // Validate seat
    const soGhe = await SoGheSoGiuong.findOne({
      maSoGhe,
      xeId: chuyenXe.xeId,
      trangThai: 'Available',
    });
    if (!soGhe) throw new Error('Ghế không tồn tại hoặc đã được đặt');

    // Calculate total price with promotion (if any)
    let tongTien = chuyenXe.gia;
    if (khuyenMaiId) {
      const khuyenMai = await KhuyenMai.findById(khuyenMaiId);
      if (!khuyenMai) throw new Error('Khuyến mãi không tồn tại');
      tongTien = tongTien * (1 - (khuyenMai.discount || 0));
    }

    // Update seat status
    soGhe.trangThai = 'Booked';
    await soGhe.save();

    // Create ticket
    const veXe = new VeXe({
      nhanVienId: null,
      chuyenXeId,
      khachHangId,
      maSoGhe,
      xeId: chuyenXe.xeId,
      ngayDatVe: new Date(),
      khuyenMaiId: khuyenMaiId || null,
      tongTien,
      trangThai: 'Booked',
    });
    await veXe.save();

    // Create ticket history
    const lichSuVeXe = new LichSuVeXe({
      veXeId: veXe._id,
      trangThai: 'Booked',
      ngayThayDoi: new Date(),
      ghiChu: 'Vé được đặt bởi khách hàng',
    });
    await lichSuVeXe.save();

    return veXe;
  } catch (error) {
    throw new Error(error.message);
  }
  
};
const getAvailableSeats = async (chuyenXeId) => {
    try {
        const chuyenXe = await ChuyenXe.findById(chuyenXeId).populate('xeId');
        if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');

        const availableSeats = await SoGheSoGiuong.find({
            xeId: chuyenXe.xeId._id,
            trangThai: 'Available',
        }).select('maSoGhe');

        return availableSeats;
    } catch (error) {
        throw new Error(error.message);
    }
};

const payVeXe = async (veXeId, data, khachHangId) => {
  const { phuongThucThanhToan, diaChiDon, diaChiTra, thongTinKhachHang } = data;
  const veXe = await VeXe.findById(veXeId);
  if (!veXe) throw new Error('Vé xe không tồn tại');
  if (veXe.khachHangId.toString() !== khachHangId.toString()) throw new Error('Không có quyền thanh toán vé này');
  if (veXe.trangThai !== 'Booked') throw new Error('Vé không ở trạng thái chờ thanh toán');

  // Cập nhật thông tin vé
  veXe.phuongThucThanhToan = phuongThucThanhToan;
  veXe.diaChiDon = diaChiDon;
  veXe.diaChiTra = diaChiTra;
  veXe.thongTinKhachHang = thongTinKhachHang;
  veXe.trangThai = 'Paid';
  await veXe.save();

  // Lưu lịch sử vé
  await new LichSuVeXe({
    veXeId: veXe._id,
    trangThai: 'Paid',
    ngayThayDoi: new Date(),
    ghiChu: 'Khách hàng đã thanh toán vé'
  }).save();

  // Tạo bản ghi thanh toán
  const chuyenXe = await ChuyenXe.findById(veXe.chuyenXeId);
  const ThanhToan = require('../models/thanhToan');
  await new ThanhToan({
    khachHangId,
    nhaXeId: chuyenXe.nhaXeId,
    veXeId: veXe._id,
    phuongThucThanhToan,
    soTien: veXe.tongTien,
    trangThai: 'Paid',
    thoiGianGiaoDich: new Date(),
    paymentGatewayId: '',
    diaChiDon,
    diaChiTra,
    thongTinKhachHang
  }).save();

  return veXe;
};

const cancelVeXe = async (veXeId, khachHangId, lyDoHuy) => {
  const veXe = await VeXe.findById(veXeId);
  if (!veXe) throw new Error('Vé xe không tồn tại');
  if (veXe.khachHangId.toString() !== khachHangId.toString()) throw new Error('Không có quyền hủy vé này');
  if (!['Booked', 'Paid'].includes(veXe.trangThai)) throw new Error('Vé không thể hủy ở trạng thái hiện tại');

  veXe.trangThai = 'Cancelled';
  await veXe.save();

  // Lưu lịch sử vé
  await new LichSuVeXe({
    veXeId: veXe._id,
    trangThai: 'Cancelled',
    ngayThayDoi: new Date(),
    ghiChu: lyDoHuy || 'Khách hàng hủy vé'
  }).save();

  return veXe;
};

module.exports = {
  getAllVeXe,
  createVeXe,
  createVeXeAdmin,
  updateVeXe,
  deleteVeXe,
  bookVeXeService,
  getAvailableSeats,
  payVeXe,
  cancelVeXe,
};
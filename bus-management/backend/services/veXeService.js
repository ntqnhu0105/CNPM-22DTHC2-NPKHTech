const mongoose = require('mongoose');
const { VeXe, NhanVien, ChuyenXe, KhachHang, Xe, SoGheSoGiuong, KhuyenMai } = require('../models');

const getAllVeXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const veXes = await VeXe.find()
    .populate('nhanVienId', 'hoVaTen')
    .populate('chuyenXeId', 'thoiGianKhoiHanh')
    .populate('khachHangId', 'hoVaTen')
    .populate('xeId', 'bienSoXe')
    .populate('khuyenMaiId', 'code')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await VeXe.countDocuments();
  return { veXes, total, page, limit };
};

const createVeXe = async (data) => {
  const { nhanVienId, chuyenXeId, khachHangId, maSoGhe, xeId, ngayDatVe, khuyenMaiId, tongTien } = data;

  const nhanVien = await NhanVien.findById(nhanVienId);
  if (!nhanVien) throw new Error('Nhân viên không tồn tại');
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

  const veXe = new VeXe({ nhanVienId, chuyenXeId, khachHangId, maSoGhe, xeId, ngayDatVe, khuyenMaiId, tongTien, trangThai: 'Booked' });
  return await veXe.save();
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
  await veXe.deleteOne();
  return { message: 'Xóa vé xe thành công' };
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


module.exports = {
  getAllVeXe,
  createVeXe,
  updateVeXe,
  deleteVeXe,
  bookVeXeService,
  getAvailableSeats, // Thêm service mới
};
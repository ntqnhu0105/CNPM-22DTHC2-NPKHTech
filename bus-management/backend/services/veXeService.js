const mongoose = require('mongoose');
const { VeXe, NhanVien, ChuyenXe, KhachHang, Xe, SoGheSoGiuong, KhuyenMai, LichSuVeXe, ThanhToan, ThongBao } = require('../models');

const getAllVeXe = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const veXes = await VeXe.find({ trangThai: { $ne: 'Deleted' } })
    .populate('nhanVienId', 'hoVaTen')
    .populate({
      path: 'chuyenXeId',
      populate: { path: 'tuyenXeId', select: 'diemDi diemDen' },
      select: 'thoiGianKhoiHanh gia'
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

const bookVeXeService = async ({ chuyenXeId, danhSachGhe, khachHangId, khuyenMaiId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const khachHang = await KhachHang.findById(khachHangId).session(session);
    if (!khachHang) throw new Error('Khách hàng không tồn tại');

    const chuyenXe = await ChuyenXe.findById(chuyenXeId).populate('xeId').session(session);
    if (!chuyenXe) throw new Error('Chuyến xe không tồn tại');

    let veXes = [];
    let tongTienDonGia = chuyenXe.gia;
    
    if (khuyenMaiId) {
      const khuyenMai = await KhuyenMai.findById(khuyenMaiId).session(session);
      if (khuyenMai) tongTienDonGia = tongTienDonGia * (1 - (khuyenMai.phanTramGiamGia / 100));
    }

    for (const maSoGhe of danhSachGhe) {
        // 1. Kiểm tra ghế trống
        const soGhe = await SoGheSoGiuong.findOne({
            maSoGhe,
            xeId: chuyenXe.xeId._id,
            trangThai: 'Available',
        }).session(session);

        if (!soGhe) throw new Error(`Ghế ${maSoGhe} đã bị người khác đặt hoặc không tồn tại`);

        // 2. Cập nhật ghế
        soGhe.trangThai = 'Booked';
        await soGhe.save({ session });

        // 3. Tạo vé
        const veXe = new VeXe({
            chuyenXeId,
            khachHangId,
            maSoGhe,
            xeId: chuyenXe.xeId._id,
            ngayDatVe: new Date(),
            khuyenMaiId: khuyenMaiId || null,
            tongTien: tongTienDonGia,
            trangThai: 'Booked',
        });
        await veXe.save({ session });
        veXes.push(veXe);

        // 4. Lưu lịch sử
        await new LichSuVeXe({
            veXeId: veXe._id,
            trangThai: 'Booked',
            ngayThayDoi: new Date(),
            ghiChu: 'Đặt vé thành công',
        }).save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    
    return veXes; // Trả về danh sách vé đã đặt

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
  
  // Khởi tạo Transaction (Bảo vệ dữ liệu)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Tìm vé (Kèm session)
    const veXe = await VeXe.findById(veXeId).session(session);
    if (!veXe) throw new Error('Vé xe không tồn tại');
    
    // 2. Validate quyền sở hữu
    if (veXe.khachHangId.toString() !== khachHangId.toString()) {
      throw new Error('Không có quyền thanh toán vé này');
    }

    // 3. Validate trạng thái
    if (veXe.trangThai !== 'Booked') {
      throw new Error('Vé không ở trạng thái chờ thanh toán (có thể đã hủy hoặc đã trả tiền)');
    }

    // 4. CHECK TIMEOUT: Kiểm tra xem vé có quá hạn 10 phút không?
    const now = new Date();
    const bookingTime = new Date(veXe.ngayDatVe);
    const diffMinutes = (now - bookingTime) / 60000; // Đổi ra phút

    if (diffMinutes > 15) { // Cho phép giữ chỗ 15 phút
        veXe.trangThai = 'Cancelled';
        await veXe.save({ session });
        
        // Trả lại ghế
        await SoGheSoGiuong.findOneAndUpdate(
            { maSoGhe: veXe.maSoGhe, xeId: veXe.xeId },
            { trangThai: 'Available' },
            { session }
        );
        
        await session.commitTransaction(); // Lưu việc hủy
        throw new Error('Vé đã hết hạn giữ chỗ (quá 15 phút). Vui lòng đặt lại.');
    }

    // 5. Cập nhật thông tin vé
    veXe.phuongThucThanhToan = phuongThucThanhToan;
    veXe.diaChiDon = diaChiDon;
    veXe.diaChiTra = diaChiTra;
    veXe.thongTinKhachHang = thongTinKhachHang;
    veXe.trangThai = 'Paid';
    await veXe.save({ session });

    // 6. Lưu lịch sử
    await new LichSuVeXe({
      veXeId: veXe._id,
      trangThai: 'Paid',
      ngayThayDoi: new Date(),
      ghiChu: `Thanh toán thành công qua ${phuongThucThanhToan}`
    }).save({ session });

    // 7. Tạo bản ghi Thanh Toán
    const chuyenXe = await ChuyenXe.findById(veXe.chuyenXeId).session(session);
    
    await new ThanhToan({
      khachHangId,
      nhaXeId: chuyenXe.nhaXeId,
      veXeId: veXe._id,
      phuongThucThanhToan,
      soTien: veXe.tongTien,
      trangThai: 'Success', // Đã trả tiền thì là Success luôn
      thoiGianGiaoDich: new Date(),
      diaChiDon,
      diaChiTra,
      thongTinKhachHang
    }).save({ session });

    await new ThongBao({
        khachHangId,
        tieuDe: 'Thanh toán thành công',
        noiDung: `Bạn đã thanh toán thành công vé ${veXe.maSoGhe}. Chúc bạn thượng lộ bình an!`,
        ngayGui: new Date(),
        trangThai: 'Sent'
    }).save({ session });

    // Chốt giao dịch
    await session.commitTransaction();
    session.endSession();

    return veXe;

  } catch (error) {
    // Nếu có lỗi bất kỳ -> Rollback toàn bộ (Không trừ tiền, không đổi trạng thái)
    await session.abortTransaction();
    session.endSession();
    throw error; // Ném lỗi ra cho Controller bắt
  }
};

const cancelVeXe = async (veXeId, khachHangId, lyDoHuy) => {
  const veXe = await VeXe.findById(veXeId);
  if (!veXe) throw new Error('Vé xe không tồn tại');
  if (veXe.khachHangId.toString() !== khachHangId.toString()) throw new Error('Không có quyền hủy vé này');
  
  if (!['Booked', 'Paid'].includes(veXe.trangThai)) throw new Error('Vé không thể hủy ở trạng thái hiện tại');

  const chuyenXe = await ChuyenXe.findById(veXe.chuyenXeId);
  if (chuyenXe) {
    const now = new Date();
    const gioKhoiHanh = new Date(chuyenXe.thoiGianKhoiHanh);
    
    const diffHours = (gioKhoiHanh - now) / (1000 * 60 * 60);

    // Nếu còn dưới 24h thì không cho hủy
    if (diffHours < 24) {
      throw new Error('Chỉ được hủy vé trước giờ khởi hành ít nhất 24 tiếng.');
    }
  }

  const soGhe = await SoGheSoGiuong.findOne({ 
      maSoGhe: veXe.maSoGhe, 
      xeId: veXe.xeId 
  });
  if (soGhe) {
      soGhe.trangThai = 'Available'; // Trả lại ghế trống
      await soGhe.save();
  }

  veXe.trangThai = 'Cancelled';
  await veXe.save();

  await new LichSuVeXe({
    veXeId: veXe._id,
    trangThai: 'Cancelled',
    ngayThayDoi: new Date(),
    ghiChu: lyDoHuy || 'Khách hàng hủy vé (đúng quy định)'
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
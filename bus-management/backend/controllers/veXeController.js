const { getAllVeXe, createVeXe, createVeXeAdmin, updateVeXe, deleteVeXe: deleteVeXeService, getAvailableSeats: getAvailableSeatsService, payVeXe, cancelVeXe } = require('../services/veXeService');
const { bookVeXeService } = require('../services/veXeService'); // Add this import
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { ChuyenXe, VeXe, SoGheSoGiuong } = require('../models');

const getVeXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllVeXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.veXes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const getMyTickets = async (req, res, next) => {
  try {
    const khachHangId = req.user.khachHangId;
    if (!khachHangId) return res.status(400).json({ error: 'Không tìm thấy thông tin khách hàng' });

    const veXes = await VeXe.find({ khachHangId })
      .populate({
        path: 'chuyenXeId',
        select: 'thoiGianKhoiHanh gia',
        populate: { path: 'tuyenXeId', select: 'diemDi diemDen thoiGianDuKien' }
      })
      .populate('xeId', 'bienSoXe loaiXeId')
      .populate('khuyenMaiId', 'tenKhuyenMai')
      .sort({ ngayDatVe: -1 }); // Vé mới nhất lên đầu

    res.json({ success: true, data: veXes });
  } catch (err) {
    next(err);
  }
};

const postVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Lấy khachHangId từ token (req.user)
    const khachHangId = req.user.khachHangId;
    const veXe = await createVeXe({ ...req.body, khachHangId });
    res.status(201).json({ data: veXe, message: 'Tạo vé xe thành công' });
  } catch (err) {
    next(err);
  }
};

const postVeXeAdmin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Sử dụng khachHangId từ form (admin tạo vé cho khách hàng)
    const veXe = await createVeXeAdmin(req.body);
    res.status(201).json({ data: veXe, message: 'Tạo vé xe thành công' });
  } catch (err) {
    next(err);
  }
};

const putVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const veXe = await updateVeXe(req.params.id, req.body);
    res.json({ data: veXe, message: 'Cập nhật vé xe thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteVeXeService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const bookVeXe = async (req, res, next) => {
  console.log('Book ticket request:', req.body, req.user); // Debug log
  try {
    const { chuyenXeId, danhSachGhe, khuyenMaiId } = req.body; 
    const khachHangId = req.user.khachHangId;
    
    if (!Array.isArray(danhSachGhe) || danhSachGhe.length === 0) {
        return res.status(400).json({ error: 'Vui lòng chọn ít nhất 1 ghế' });
    }

    // Gọi service mới
    const result = await bookVeXeService({
      chuyenXeId,
      danhSachGhe, // Truyền mảng
      khachHangId,
      khuyenMaiId,
    });
    res.status(201).json({ data: result, message: 'Đặt vé thành công' });
  } catch (err) {
    next(err);
  }
};

const getAvailableSeats = async (req, res, next) => {
    try {
        const { chuyenXeId } = req.params;
        
        // 1. Lấy thông tin chuyến xe để biết Tổng số ghế
        const chuyenXe = await ChuyenXe.findById(chuyenXeId).populate('xeId');
        if (!chuyenXe) return res.status(404).json({ message: 'Chuyến xe không tồn tại' });

        const tongSoGhe = chuyenXe.xeId.soGhe;
        const bienSoXe = chuyenXe.xeId.bienSoXe;

        // 2. Lấy danh sách các ghế ĐÃ ĐẶT (Booked, Paid)
        const veDaDat = await VeXe.find({
            chuyenXeId: chuyenXeId,
            trangThai: { $in: ['Booked', 'Paid'] }
        }).select('maSoGhe');

        const gheDaDat = veDaDat.map(v => v.maSoGhe);

        res.json({ 
            success: true,
            tongSoGhe: tongSoGhe,
            gheDaDat: gheDaDat,
            bienSoXe: bienSoXe
        });

    } catch (err) {
        next(err);
    }
};

const payVeXeController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // 1. Nhận captchaText và captchaToken từ Mobile
    const { captchaText, captchaToken } = req.body;

    if (!captchaText || !captchaToken) {
        return res.status(400).json({ error: 'Vui lòng nhập mã Captcha để xác nhận' });
    }

    // 2. Xác thực Captcha
    try {
        const decoded = jwt.verify(captchaToken, process.env.JWT_SECRET);
        if (captchaText.toLowerCase() !== decoded.answer) {
            return res.status(400).json({ error: 'Mã Captcha không đúng' });
        }
    } catch (err) {
        return res.status(400).json({ error: 'Captcha hết hạn hoặc không hợp lệ' });
    }

    // 3. Nếu đúng thì tiến hành thanh toán
    const veXe = await payVeXe(req.params.id, req.body, req.user.khachHangId);
    res.json({ data: veXe, message: 'Thanh toán vé thành công' });
  } catch (err) {
    next(err);
  }
};

const cancelVeXeController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const veXe = await cancelVeXe(req.params.id, req.user.khachHangId, req.body.lyDoHuy);
    res.json({ data: veXe, message: 'Hủy vé thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVeXe,
  getMyTickets,
  postVeXe,
  postVeXeAdmin,
  putVeXe,
  deleteVeXe,
  bookVeXe,
  getAvailableSeats,
  payVeXeController,
  cancelVeXeController,
};
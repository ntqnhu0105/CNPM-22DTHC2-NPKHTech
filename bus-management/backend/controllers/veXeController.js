const { getAllVeXe, createVeXe, updateVeXe, deleteVeXe: deleteVeXeService } = require('../services/veXeService');
const { bookVeXeService } = require('../services/veXeService'); // Add this import
const { validationResult } = require('express-validator');

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

const postVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const veXe = await createVeXe(req.body);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Debug log
      return res.status(400).json({ errors: errors.array() });
    }
    const { chuyenXeId, maSoGhe, khuyenMaiId } = req.body;
    const khachHangId = req.user.khachHangId;
    console.log('khachHangId:', khachHangId); // Debug log
    if (!khachHangId) {
      return res.status(400).json({ error: 'Thông tin khách hàng không hợp lệ' });
    }
    const veXe = await bookVeXeService({
      chuyenXeId,
      maSoGhe,
      khachHangId,
      khuyenMaiId,
    });
    res.status(201).json({ data: veXe, message: 'Đặt vé thành công' });
  } catch (err) {
    console.error('Booking error:', err.message, err.stack); // Debug log chi tiết
    next(err);
  }
};
const getAvailableSeats = async (req, res, next) => {
    try {
        const { chuyenXeId } = req.params;
        const availableSeats = await getAvailableSeats(chuyenXeId);
        res.json({ availableSeats });
    } catch (err) {
        console.error('Error fetching available seats:', err.message, err.stack);
        next(err);
    }
};

module.exports = {
  getVeXe,
  postVeXe,
  putVeXe,
  deleteVeXe,
  bookVeXe,
  getAvailableSeats, // Export the new controller
};
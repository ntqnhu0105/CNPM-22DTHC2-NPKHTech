const { 
  getAllKhachHang, 
  createKhachHang, 
  updateKhachHang: updateKhachHangService,
  deleteKhachHang: deleteKhachHangService 
} = require('../services/khachHangService');

const { validationResult } = require('express-validator');
const { KhachHang } = require('../models');

const getProfile = async (req, res, next) => {
  try {
    const khachHangId = req.user.khachHangId;
    if (!khachHangId) {
      return res.status(404).json({ success: false, message: "Tài khoản này chưa liên kết hồ sơ khách hàng" });
    }
    const khachHang = await KhachHang.findById(khachHangId);
    if (!khachHang) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ" });
    }
    res.json({ success: true, data: khachHang });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const khachHangId = req.user.khachHangId;
    
    if (!khachHangId) {
        return res.status(400).json({ success: false, message: 'Tài khoản này chưa liên kết thông tin khách hàng' });
    }

    const updatedData = await updateKhachHangService(khachHangId, req.body);

    res.json({ 
        success: true, 
        message: "Cập nhật hồ sơ thành công", 
        data: updatedData 
    });
  } catch (err) {
    next(err);
  }
};

const getKhachHang = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllKhachHang({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.khachHangs,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postKhachHang = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const khachHang = await createKhachHang(req.body);
    res.status(201).json({ data: khachHang, message: 'Tạo khách hàng thành công' });
  } catch (err) {
    next(err);
  }
};

const putKhachHang = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const khachHang = await updateKhachHangService(req.params.id, req.body);
    res.json({ data: khachHang, message: 'Cập nhật khách hàng thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteKhachHang = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteKhachHangService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getKhachHang,
  postKhachHang,
  putKhachHang,
  deleteKhachHang,
  getProfile,
  updateProfile,
};
const { getAllKhachHang, createKhachHang, updateKhachHang, deleteKhachHang: deleteKhachHangService } = require('../services/khachHangService');
const { validationResult } = require('express-validator');

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
    const khachHang = await updateKhachHang(req.params.id, req.body);
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
};
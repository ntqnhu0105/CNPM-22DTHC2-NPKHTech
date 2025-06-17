const { getAllThanhToan, createThanhToan, updateThanhToan, deleteThanhToan } = require('../services/thanhToanService');
const { validationResult } = require('express-validator');

const getThanhToan = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllThanhToan({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.thanhToans,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postThanhToan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const thanhToan = await createThanhToan(req.body);
    res.status(201).json({ data: thanhToan, message: 'Tạo thanh toán thành công' });
  } catch (err) {
    next(err);
  }
};

const putThanhToan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const thanhToan = await updateThanhToan(req.params.id, req.body);
    res.json({ data: thanhToan, message: 'Cập nhật thanh toán thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteThanhToan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteThanhToan(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getThanhToan,
  postThanhToan,
  putThanhToan,
  deleteThanhToan,
};
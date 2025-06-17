const { getAllLoaiXe, createLoaiXe, updateLoaiXe, deleteLoaiXe } = require('../services/loaiXeService');
const { validationResult } = require('express-validator');

const getLoaiXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllLoaiXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.loaiXes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postLoaiXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const loaiXe = await createLoaiXe(req.body);
    res.status(201).json({ data: loaiXe, message: 'Tạo loại xe thành công' });
  } catch (err) {
    next(err);
  }
};

const putLoaiXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const loaiXe = await updateLoaiXe(req.params.id, req.body);
    res.json({ data: loaiXe, message: 'Cập nhật loại xe thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteLoaiXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteLoaiXe(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLoaiXe,
  postLoaiXe,
  putLoaiXe,
  deleteLoaiXe,
};
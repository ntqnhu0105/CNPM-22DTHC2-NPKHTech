const { getAllDanhGia, createDanhGia, updateDanhGia, deleteDanhGia: deleteDanhGiaService } = require('../services/danhGiaService');
const { validationResult } = require('express-validator');

const getDanhGia = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllDanhGia({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.danhGias,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postDanhGia = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const danhGia = await createDanhGia(req.body);
    res.status(201).json({ data: danhGia, message: 'Tạo đánh giá thành công' });
  } catch (err) {
    next(err);
  }
};

const putDanhGia = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const danhGia = await updateDanhGia(req.params.id, req.body);
    res.json({ data: danhGia, message: 'Cập nhật đánh giá thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteDanhGia = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteDanhGiaService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDanhGia,
  postDanhGia,
  putDanhGia,
  deleteDanhGia,
};
const { getAllChuyenXe, createChuyenXe, updateChuyenXe, deleteChuyenXe } = require('../services/chuyenXeService');
const { validationResult } = require('express-validator');

const getChuyenXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllChuyenXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.chuyenXes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postChuyenXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const chuyenXe = await createChuyenXe(req.body);
    res.status(201).json({ data: chuyenXe, message: 'Tạo chuyến xe thành công' });
  } catch (err) {
    next(err);
  }
};

const putChuyenXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const chuyenXe = await updateChuyenXe(req.params.id, req.body);
    res.json({ data: chuyenXe, message: 'Cập nhật chuyến xe thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteChuyenXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteChuyenXe(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChuyenXe,
  postChuyenXe,
  putChuyenXe,
  deleteChuyenXe,
};
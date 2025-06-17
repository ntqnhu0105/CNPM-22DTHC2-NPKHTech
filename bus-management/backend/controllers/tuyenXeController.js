const { getAllTuyenXe, createTuyenXe, updateTuyenXe, deleteTuyenXe } = require('../services/tuyenXeService');
const { validationResult } = require('express-validator');

const getTuyenXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllTuyenXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.tuyenXes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postTuyenXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const tuyenXe = await createTuyenXe(req.body);
    res.status(201).json({ data: tuyenXe, message: 'Tạo tuyến xe thành công' });
  } catch (err) {
    next(err);
  }
};

const putTuyenXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const tuyenXe = await updateTuyenXe(req.params.id, req.body);
    res.json({ data: tuyenXe, message: 'Cập nhật tuyến xe thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteTuyenXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteTuyenXe(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTuyenXe,
  postTuyenXe,
  putTuyenXe,
  deleteTuyenXe,
};
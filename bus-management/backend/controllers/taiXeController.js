const { getAllTaiXe, createTaiXe, updateTaiXe, deleteTaiXe: deleteTaiXeService } = require('../services/taiXeService');
const { validationResult } = require('express-validator');

const getTaiXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllTaiXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.taiXes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postTaiXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const taiXe = await createTaiXe(req.body);
    res.status(201).json({ data: taiXe, message: 'Tạo tài xế thành công' });
  } catch (err) {
    next(err);
  }
};

const putTaiXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const taiXe = await updateTaiXe(req.params.id, req.body);
    res.json({ data: taiXe, message: 'Cập nhật tài xế thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteTaiXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteTaiXeService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTaiXe,
  postTaiXe,
  putTaiXe,
  deleteTaiXe,
};
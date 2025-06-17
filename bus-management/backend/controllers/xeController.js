const { getAllXe, createXe, updateXe, deleteXe: deleteXeService } = require('../services/xeService');
const { validationResult } = require('express-validator');

const getXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.xes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const xe = await createXe(req.body);
    res.status(201).json({ data: xe, message: 'Tạo xe thành công' });
  } catch (err) {
    next(err);
  }
};

const putXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const xe = await updateXe(req.params.id, req.body);
    res.json({ data: xe, message: 'Cập nhật xe thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteXeService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getXe,
  postXe,
  putXe,
  deleteXe,
};
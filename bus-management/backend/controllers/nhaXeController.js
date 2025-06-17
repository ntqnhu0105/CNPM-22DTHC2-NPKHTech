const { getAllNhaXe, createNhaXe, updateNhaXe, deleteNhaXe } = require('../services/nhaXeService');
const { validationResult } = require('express-validator');

const getNhaXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllNhaXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.nhaXes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postNhaXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const nhaXe = await createNhaXe(req.body);
    res.status(201).json({ data: nhaXe, message: 'Tạo nhà xe thành công' });
  } catch (err) {
    next(err);
  }
};

const putNhaXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const nhaXe = await updateNhaXe(req.params.id, req.body);
    res.json({ data: nhaXe, message: 'Cập nhật nhà xe thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteNhaXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteNhaXe(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNhaXe,
  postNhaXe,
  putNhaXe,
  deleteNhaXe,
};
const { getAllVeXe, createVeXe, updateVeXe, deleteVeXe: deleteVeXeService } = require('../services/veXeService');
const { validationResult } = require('express-validator');

const getVeXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllVeXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.veXes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const veXe = await createVeXe(req.body);
    res.status(201).json({ data: veXe, message: 'Tạo vé xe thành công' });
  } catch (err) {
    next(err);
  }
};

const putVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const veXe = await updateVeXe(req.params.id, req.body);
    res.json({ data: veXe, message: 'Cập nhật vé xe thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteVeXeService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVeXe,
  postVeXe,
  putVeXe,
  deleteVeXe,
};
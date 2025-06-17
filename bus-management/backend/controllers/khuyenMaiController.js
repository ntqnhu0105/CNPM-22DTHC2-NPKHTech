const { getAllKhuyenMai, createKhuyenMai, updateKhuyenMai, deleteKhuyenMai } = require('../services/khuyenMaiService');
const { validationResult } = require('express-validator');

const getKhuyenMai = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllKhuyenMai({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.khuyenMais,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postKhuyenMai = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const khuyenMai = await createKhuyenMai(req.body);
    res.status(201).json({ data: khuyenMai, message: 'Tạo khuyến mãi thành công' });
  } catch (err) {
    next(err);
  }
};

const putKhuyenMai = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const khuyenMai = await updateKhuyenMai(req.params.id, req.body);
    res.json({ data: khuyenMai, message: 'Cập nhật khuyến mãi thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteKhuyenMai = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteKhuyenMai(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getKhuyenMai,
  postKhuyenMai,
  putKhuyenMai,
  deleteKhuyenMai,
};
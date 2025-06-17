const { getAllSoGheSoGiuong, createSoGheSoGiuong, updateSoGheSoGiuong, deleteSoGheSoGiuong } = require('../services/soGheSoGiuongService');
const { validationResult } = require('express-validator');

const getSoGheSoGiuong = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllSoGheSoGiuong({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.soGheSoGiuongs,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postSoGheSoGiuong = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const soGheSoGiuong = await createSoGheSoGiuong(req.body);
    res.status(201).json({ data: soGheSoGiuong, message: 'Tạo số ghế/số giường thành công' });
  } catch (err) {
    next(err);
  }
};

const putSoGheSoGiuong = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const soGheSoGiuong = await updateSoGheSoGiuong(req.params.id, req.body);
    res.json({ data: soGheSoGiuong, message: 'Cập nhật số ghế/số giường thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteSoGheSoGiuong = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteSoGheSoGiuong(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSoGheSoGiuong,
  postSoGheSoGiuong,
  putSoGheSoGiuong,
  deleteSoGheSoGiuong,
};
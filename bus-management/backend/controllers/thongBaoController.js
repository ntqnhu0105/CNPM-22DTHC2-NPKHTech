const { getAllThongBao, createThongBao, updateThongBao, deleteThongBao } = require('../services/thongBaoService');
const { validationResult } = require('express-validator');

const getThongBao = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllThongBao({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.thongBaos,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postThongBao = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const thongBao = await createThongBao(req.body);
    res.status(201).json({ data: thongBao, message: 'Tạo thông báo thành công' });
  } catch (err) {
    next(err);
  }
};

const putThongBao = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const thongBao = await updateThongBao(req.params.id, req.body);
    res.json({ data: thongBao, message: 'Cập nhật thông báo thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteThongBao = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteThongBao(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getThongBao,
  postThongBao,
  putThongBao,
  deleteThongBao,
};
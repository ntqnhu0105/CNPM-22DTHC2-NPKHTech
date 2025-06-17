const { getAllNhanVien, createNhanVien, updateNhanVien, deleteNhanVien: deleteNhanVienService } = require('../services/nhanVienService');
const { validationResult } = require('express-validator');

const getNhanVien = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllNhanVien({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.nhanViens,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postNhanVien = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const nhanVien = await createNhanVien(req.body);
    res.status(201).json({ data: nhanVien, message: 'Tạo nhân viên thành công' });
  } catch (err) {
    next(err);
  }
};

const putNhanVien = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const nhanVien = await updateNhanVien(req.params.id, req.body);
    res.json({ data: nhanVien, message: 'Cập nhật nhân viên thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteNhanVien = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteNhanVienService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNhanVien,
  postNhanVien,
  putNhanVien,
  deleteNhanVien,
};
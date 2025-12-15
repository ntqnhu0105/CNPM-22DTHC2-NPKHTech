const { getAllNhanVien, createNhanVien, updateNhanVien, deleteNhanVien: deleteNhanVienService } = require('../services/nhanVienService');
const { validationResult } = require('express-validator');
const nhanVienService = require('../services/nhanVienService');

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
    const result = await nhanVienService.createNhanVien(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(err);
  }
};

const putNhanVien = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await nhanVienService.updateNhanVien(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};

const deleteNhanVien = async (req, res, next) => {
  try {
    const result = await nhanVienService.deleteNhanVien(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(err);
  }
};

module.exports = {
  getNhanVien,
  postNhanVien,
  putNhanVien,
  deleteNhanVien,
};
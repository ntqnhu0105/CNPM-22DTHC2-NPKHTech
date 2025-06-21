
const { validationResult } = require('express-validator');
const {
  getAllSoGheSoGiuong,
  createSoGheSoGiuong,
  bulkCreateSoGheSoGiuong,
  updateSoGheSoGiuong,
  deleteSoGheSoGiuong,
  deleteAllSoGheSoGiuongByXeId,
} = require('../services/soGheSoGiuongService');

const getSoGheSoGiuong = async (req, res, next) => {
  try {
    const { page, limit, xeId } = req.query;
    const result = await getAllSoGheSoGiuong({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 100,
      xeId,
    });
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
    console.log('POST /api/soghe-sogiuong called', req.body); // Debugging
    const soGheSoGiuong = await createSoGheSoGiuong(req.body);
    res.status(201).json({ data: soGheSoGiuong, message: 'Tạo số ghế/số giường thành công' });
  } catch (err) {
    next(err);
  }
};

const postBulkSoGheSoGiuong = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('POST /api/soghe-sogiuong/bulk called', req.body); // Debugging
    const { xeId, soGhe, force } = req.body;
    const seats = await bulkCreateSoGheSoGiuong({ xeId, soGhe, force });
    res.status(201).json({ data: seats, message: 'Tạo hàng loạt số ghế/số giường thành công' });
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

const handledeleteSoGheSoGiuong = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('DELETE /api/soghe-sogiuong called', req.params.id); // Debugging
    const result = await deleteSoGheSoGiuong(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const handledeleteAllSoGheSoGiuongByXeId = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('DELETE /api/soghe-sogiuong/by-xe-id called', req.params.xeId); // Debugging
    const result = await deleteAllSoGheSoGiuongByXeId(req.params.xeId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSoGheSoGiuong,
  postSoGheSoGiuong,
  postBulkSoGheSoGiuong,
  putSoGheSoGiuong,
  deleteSoGheSoGiuong: handledeleteSoGheSoGiuong,
  deleteAllSoGheSoGiuongByXeId: handledeleteAllSoGheSoGiuongByXeId,
};
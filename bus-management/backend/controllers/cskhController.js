const { getAllCSKH, createCSKH, updateCSKH, deleteCSKH } = require('../services/cskhService');
const { validationResult } = require('express-validator');

const getCSKH = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllCSKH({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.cskhs,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postCSKH = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const cskh = await createCSKH(req.body);
    res.status(201).json({ data: cskh, message: 'Tạo CSKH thành công' });
  } catch (err) {
    next(err);
  }
};

const putCSKH = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const cskh = await updateCSKH(req.params.id, req.body);
    res.json({ data: cskh, message: 'Cập nhật CSKH thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteCSKH = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteCSKH(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCSKH,
  postCSKH,
  putCSKH,
  deleteCSKH,
};
const { getAllThongBao, createThongBao, updateThongBao, deleteThongBao: deleteThongBaoService, markAsRead, markAllAsRead, toggleImportant } = require('../services/thongBaoService');
const { validationResult } = require('express-validator');

const getThongBao = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    
    const khachHangId = req.user.khachHangId;

    const result = await getAllThongBao({ page: parseInt(page), limit: parseInt(limit), khachHangId });
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
    const result = await deleteThongBaoService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const markThongBaoAsRead = async (req, res, next) => {
  try {
    const thongBao = await markAsRead(req.params.id);
    res.json({ data: thongBao, message: 'Đã đánh dấu đã đọc' });
  } catch (err) {
    next(err);
  }
};

const markAllThongBaoAsRead = async (req, res, next) => {
  try {
    const khachHangId = req.user.khachHangId; 
    const result = await markAllAsRead(khachHangId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const toggleThongBaoImportant = async (req, res, next) => {
  try {
    const thongBao = await toggleImportant(req.params.id);
    res.json({ data: thongBao, message: 'Cập nhật trạng thái quan trọng thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getThongBao,
  postThongBao,
  putThongBao,
  deleteThongBao,
  markThongBaoAsRead,
  markAllThongBaoAsRead,
  toggleThongBaoImportant,
};
const { getAllLichSuVeXe, createLichSuVeXe, updateLichSuVeXe, deleteLichSuVeXe: deleteLichSuVeXeService } = require('../services/lichSuVeXeService');
const { validationResult } = require('express-validator');
const { VeXe, LichSuVeXe } = require('../models');

const getLichSuVeXe = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllLichSuVeXe({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.lichSuVeXes,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postLichSuVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const lichSuVeXe = await createLichSuVeXe(req.body);
    res.status(201).json({ data: lichSuVeXe, message: 'Tạo lịch sử vé xe thành công' });
  } catch (err) {
    next(err);
  }
};

const putLichSuVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const lichSuVeXe = await updateLichSuVeXe(req.params.id, req.body);
    res.json({ data: lichSuVeXe, message: 'Cập nhật lịch sử vé xe thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteLichSuVeXe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteLichSuVeXeService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getLichSuVeXeByCustomer = async (req, res, next) => {
  try {
    const khachHangId = req.user.khachHangId;
    if (!khachHangId) return res.status(400).json({ error: 'Không tìm thấy thông tin khách hàng' });
    const veXes = await VeXe.find({ khachHangId }).select('_id');
    const veXeIds = veXes.map(v => v._id);
    const lichSu = await LichSuVeXe.find({ veXeId: { $in: veXeIds } }).sort({ ngayThayDoi: -1 });
    res.json({ data: lichSu });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLichSuVeXe,
  postLichSuVeXe,
  putLichSuVeXe,
  deleteLichSuVeXe,
  getLichSuVeXeByCustomer,
};
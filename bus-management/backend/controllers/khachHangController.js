const { getAllKhachHang, createKhachHang } = require('../services/khachHangService');
const { validationResult } = require('express-validator');

const getKhachHang = async (req, res, next) => {
  try {
    const khachHangs = await getAllKhachHang();
    res.json(khachHangs);
  } catch (err) {
    next(err);
  }
};

const postKhachHang = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const khachHang = await createKhachHang(req.body);
    res.status(201).json(khachHang);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getKhachHang,
  postKhachHang,
};
const express = require('express');
const { body } = require('express-validator');
const { getKhachHang, postKhachHang } = require('../controllers/khachHangController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff']), getKhachHang);
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('hoVaTen').notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('sdt').matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
  ],
  postKhachHang
);

module.exports = router;
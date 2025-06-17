const express = require('express');
const { body, param } = require('express-validator');
const { getNhanVien, postNhanVien, putNhanVien, deleteNhanVien } = require('../controllers/nhanVienController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff']), getNhanVien);
router.post(
  '/',
  [
    body('cccd').isLength({ max: 12 }).withMessage('CCCD tối đa 12 ký tự'),
    body('hoVaTen').notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('nhaXeId').isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('sdt').matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('diaChi').optional().isLength({ max: 100 }).withMessage('Địa chỉ tối đa 100 ký tự'),
    body('ngaySinh').optional().isISO8601().withMessage('Ngày sinh không hợp lệ'),
  ],
  authMiddleware(['Admin']),
  postNhanVien
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID nhân viên không hợp lệ'),
    body('cccd').optional().isLength({ max: 12 }).withMessage('CCCD tối đa 12 ký tự'),
    body('hoVaTen').optional().notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('nhaXeId').optional().isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('sdt').optional().matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('diaChi').optional().isLength({ max: 100 }).withMessage('Địa chỉ tối đa 100 ký tự'),
    body('ngaySinh').optional().isISO8601().withMessage('Ngày sinh không hợp lệ'),
  ],
  authMiddleware(['Admin']),
  putNhanVien
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID nhân viên không hợp lệ'),
  ],
  authMiddleware(['Admin']),
  deleteNhanVien
);

module.exports = router;
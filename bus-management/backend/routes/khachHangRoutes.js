const express = require('express');
const { body, param } = require('express-validator');
const { 
  getKhachHang, 
  postKhachHang, 
  putKhachHang, 
  deleteKhachHang, 
  getProfile,   
  updateProfile 
} = require('../controllers/khachHangController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware(['Customer']), getProfile);
router.put(
  '/profile', 
  [
    body('hoVaTen').optional().notEmpty().withMessage('Họ và tên không được để trống'),
    body('sdt').optional().matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('diaChi').optional().isLength({ max: 100 }).withMessage('Địa chỉ tối đa 100 ký tự'),
    body('ngaySinh').optional().isISO8601().withMessage('Ngày sinh không hợp lệ'),
  ],
  authMiddleware(['Customer']), 
  updateProfile
);

router.get('/', authMiddleware(['Admin', 'Staff']), getKhachHang);

router.post(
  '/',
  [
    body('cccd').isLength({ max: 12 }).withMessage('CCCD tối đa 12 ký tự'),
    body('hoVaTen').notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('sdt').matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('diaChi').optional().isLength({ max: 100 }).withMessage('Địa chỉ tối đa 100 ký tự'),
    body('ngaySinh').optional().isISO8601().withMessage('Ngày sinh không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postKhachHang
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('cccd').optional().isLength({ max: 12 }).withMessage('CCCD tối đa 12 ký tự'),
    body('hoVaTen').optional().notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('sdt').optional().matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('diaChi').optional().isLength({ max: 100 }).withMessage('Địa chỉ tối đa 100 ký tự'),
    body('ngaySinh').optional().isISO8601().withMessage('Ngày sinh không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putKhachHang
);

router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID khách hàng không hợp lệ'),
  ],
  authMiddleware(['Admin']),
  deleteKhachHang
);

module.exports = router;
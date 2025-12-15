const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, changePasswordController, forgotPasswordController, resetPasswordController } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Tên người dùng là bắt buộc'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('role').isIn(['Admin', 'Staff', 'Customer']).withMessage('Vai trò không hợp lệ'),
    body().custom((value, { req }) => {
      if (req.body.role === 'Customer') {
        if (!req.body.cccd || !/^[0-9]{12}$/.test(req.body.cccd)) {
          throw new Error('CCCD phải có đúng 12 chữ số');
        }
        if (!req.body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
          throw new Error('Email không hợp lệ');
        }
        if (!req.body.hoVaTen) {
          throw new Error('Họ và tên là bắt buộc');
        }
        if (!req.body.sdt || !/^[0-9]{10,11}$/.test(req.body.sdt)) {
          throw new Error('SĐT phải có 10 hoặc 11 chữ số');
        }
        if (req.body.diaChi && req.body.diaChi.length > 100) {
          throw new Error('Địa chỉ tối đa 100 ký tự');
        }
        if (req.body.ngaySinh && !Date.parse(req.body.ngaySinh)) {
          throw new Error('Ngày sinh không hợp lệ');
        }
      }
      return true;
    }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Tên người dùng là bắt buộc'),
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
  ],
  loginUser
);

router.put(
  '/change-password',
  [
    body('oldPassword').notEmpty().withMessage('Mật khẩu cũ là bắt buộc'),
    body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
  ],
  authMiddleware(['Customer', 'Staff', 'Admin']), 
  changePasswordController
);

// 2. Quên mật khẩu
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Email không hợp lệ')],
  forgotPasswordController
);

// 3. Đặt lại mật khẩu bằng OTP 
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('Mã OTP phải có 6 số'),
    body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
  ],
  resetPasswordController
);

module.exports = router;
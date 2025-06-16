const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Tên người dùng là bắt buộc'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('role').isIn(['Admin', 'Staff', 'Customer']).withMessage('Vai trò không hợp lệ'),
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

module.exports = router;
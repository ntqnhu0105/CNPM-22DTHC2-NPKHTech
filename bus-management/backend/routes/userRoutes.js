const express = require('express');
const { body, param } = require('express-validator');
const { getUser, postUser, putUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin']), getUser);
router.post(
  '/',
  [
    body('username').notEmpty().withMessage('Tên đăng nhập là bắt buộc'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('role').isIn(['Admin', 'Staff', 'Customer']).withMessage('Vai trò không hợp lệ'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('phone').optional().matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
  ],
  authMiddleware(['Admin']),
  postUser
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID người dùng không hợp lệ'),
    body('username').optional().notEmpty().withMessage('Tên đăng nhập là bắt buộc'),
    body('password').optional().isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('role').optional().isIn(['Admin', 'Staff', 'Customer']).withMessage('Vai trò không hợp lệ'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('phone').optional().matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
  ],
  authMiddleware(['Admin']),
  putUser
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID người dùng không hợp lệ'),
  ],
  authMiddleware(['Admin']),
  deleteUser
);

module.exports = router;
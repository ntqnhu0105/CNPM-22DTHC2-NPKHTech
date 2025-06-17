const express = require('express');
const { body, param } = require('express-validator');
const { getNhaXe, postNhaXe, putNhaXe, deleteNhaXe } = require('../controllers/nhaXeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getNhaXe);
router.post(
  '/',
  [
    body('diaChi').notEmpty().withMessage('Địa chỉ là bắt buộc'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('sdt').matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
    body('tenNhaXe').notEmpty().withMessage('Tên nhà xe là bắt buộc'),
  ],
  authMiddleware(['Admin']),
  postNhaXe
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('diaChi').optional().notEmpty().withMessage('Địa chỉ là bắt buộc'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('sdt').optional().matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
    body('tenNhaXe').optional().notEmpty().withMessage('Tên nhà xe là bắt buộc'),
  ],
  authMiddleware(['Admin']),
  putNhaXe
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID nhà xe không hợp lệ'),
  ],
  authMiddleware(['Admin']),
  deleteNhaXe
);

module.exports = router;
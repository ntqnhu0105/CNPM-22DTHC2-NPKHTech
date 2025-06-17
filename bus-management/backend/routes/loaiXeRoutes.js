const express = require('express');
const { body, param } = require('express-validator');
const { getLoaiXe, postLoaiXe, putLoaiXe, deleteLoaiXe } = require('../controllers/loaiXeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getLoaiXe);
router.post(
  '/',
  [
    body('tenLoai').notEmpty().withMessage('Tên loại xe là bắt buộc'),
    body('moTa').optional().isLength({ max: 100 }).withMessage('Mô tả tối đa 100 ký tự'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postLoaiXe
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID loại xe không hợp lệ'),
    body('tenLoai').optional().notEmpty().withMessage('Tên loại xe là bắt buộc'),
    body('moTa').optional().isLength({ max: 100 }).withMessage('Mô tả tối đa 100 ký tự'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putLoaiXe
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID loại xe không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteLoaiXe
);

module.exports = router;
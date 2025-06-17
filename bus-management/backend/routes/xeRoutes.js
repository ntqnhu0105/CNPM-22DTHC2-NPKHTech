const express = require('express');
const { body, param } = require('express-validator');
const { getXe, postXe, putXe, deleteXe } = require('../controllers/xeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getXe);
router.post(
  '/',
  [
    body('bienSoXe').notEmpty().withMessage('Biển số xe là bắt buộc'),
    body('nhaXeId').isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('loaiXeId').isMongoId().withMessage('ID loại xe không hợp lệ'),
    body('soGhe').isInt({ min: 1 }).withMessage('Số ghế phải là số nguyên dương'),
    body('trangThai').optional().isIn(['Active', 'Inactive']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postXe
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID xe không hợp lệ'),
    body('bienSoXe').optional().notEmpty().withMessage('Biển số xe là bắt buộc'),
    body('nhaXeId').optional().isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('loaiXeId').optional().isMongoId().withMessage('ID loại xe không hợp lệ'),
    body('soGhe').optional().isInt({ min: 1 }).withMessage('Số ghế phải là số nguyên dương'),
    body('trangThai').optional().isIn(['Active', 'Inactive']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putXe
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID xe không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteXe
);

module.exports = router;
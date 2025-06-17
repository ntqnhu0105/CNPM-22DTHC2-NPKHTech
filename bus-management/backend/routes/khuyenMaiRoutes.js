const express = require('express');
const { body, param } = require('express-validator');
const { getKhuyenMai, postKhuyenMai, putKhuyenMai, deleteKhuyenMai } = require('../controllers/khuyenMaiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getKhuyenMai);
router.post(
  '/',
  [
    body('nhaXeId').isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('code').notEmpty().withMessage('Mã khuyến mãi là bắt buộc'),
    body('discount').isNumeric().withMessage('Giảm giá phải là số'),
    body('validFrom').isISO8601().withMessage('Ngày bắt đầu không hợp lệ'),
    body('validTo').isISO8601().withMessage('Ngày kết thúc không hợp lệ'),
    body('maxUsage').optional().isInt({ min: 1 }).withMessage('Số lần sử dụng tối đa phải là số nguyên dương'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postKhuyenMai
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID khuyến mãi không hợp lệ'),
    body('nhaXeId').optional().isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('code').optional().notEmpty().withMessage('Mã khuyến mãi là bắt buộc'),
    body('discount').optional().isNumeric().withMessage('Giảm giá phải là số'),
    body('validFrom').optional().isISO8601().withMessage('Ngày bắt đầu không hợp lệ'),
    body('validTo').optional().isISO8601().withMessage('Ngày kết thúc không hợp lệ'),
    body('maxUsage').optional().isInt({ min: 1 }).withMessage('Số lần sử dụng tối đa phải là số nguyên dương'),
    body('usageCount').optional().isInt({ min: 0 }).withMessage('Số lần sử dụng phải là số không âm'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putKhuyenMai
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID khuyến mãi không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteKhuyenMai
);

module.exports = router;
const express = require('express');
const { body, param } = require('express-validator');
const { getKhuyenMai, postKhuyenMai, putKhuyenMai, deleteKhuyenMai } = require('../controllers/khuyenMaiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getKhuyenMai);
router.post(
  '/',
  [
    body('tenKhuyenMai').notEmpty().withMessage('Tên khuyến mãi là bắt buộc'),
    body('phanTramGiamGia').isNumeric().withMessage('Phần trăm giảm giá phải là số'),
    body('ngayBatDau').isISO8601().withMessage('Ngày bắt đầu không hợp lệ'),
    body('ngayKetThuc').isISO8601().withMessage('Ngày kết thúc không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postKhuyenMai
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID khuyến mãi không hợp lệ'),
    body('tenKhuyenMai').optional().notEmpty().withMessage('Tên khuyến mãi là bắt buộc'),
    body('phanTramGiamGia').optional().isNumeric().withMessage('Phần trăm giảm giá phải là số'),
    body('ngayBatDau').optional().isISO8601().withMessage('Ngày bắt đầu không hợp lệ'),
    body('ngayKetThuc').optional().isISO8601().withMessage('Ngày kết thúc không hợp lệ'),
    body('trangThai').optional().isIn(['Active', 'Inactive', 'Expired']).withMessage('Trạng thái không hợp lệ'),
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
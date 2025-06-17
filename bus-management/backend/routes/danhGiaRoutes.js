const express = require('express');
const { body, param } = require('express-validator');
const { getDanhGia, postDanhGia, putDanhGia, deleteDanhGia } = require('../controllers/danhGiaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getDanhGia);
router.post(
  '/',
  [
    body('khachHangId').isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('nhaXeId').isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Điểm đánh giá phải từ 1 đến 5'),
    body('ngayDanhGia').isISO8601().withMessage('Ngày đánh giá không hợp lệ'),
    body('chuyenXeId').optional().isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    body('comment').optional().isLength({ max: 500 }).withMessage('Bình luận tối đa 500 ký tự'),
  ],
  authMiddleware(['Customer', 'Admin', 'Staff']),
  postDanhGia
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID đánh giá không hợp lệ'),
    body('khachHangId').optional().isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('nhaXeId').optional().isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Điểm đánh giá phải từ 1 đến 5'),
    body('ngayDanhGia').optional().isISO8601().withMessage('Ngày đánh giá không hợp lệ'),
    body('chuyenXeId').optional().isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    body('comment').optional().isLength({ max: 500 }).withMessage('Bình luận tối đa 500 ký tự'),
  ],
  authMiddleware(['Customer', 'Admin', 'Staff']),
  putDanhGia
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID đánh giá không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteDanhGia
);

module.exports = router;
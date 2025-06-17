const express = require('express');
const { body, param } = require('express-validator');
const { getTuyenXe, postTuyenXe, putTuyenXe, deleteTuyenXe } = require('../controllers/tuyenXeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getTuyenXe);
router.post(
  '/',
  [
    body('diemDi').notEmpty().withMessage('Điểm đi là bắt buộc'),
    body('diemDen').notEmpty().withMessage('Điểm đến là bắt buộc'),
    body('khoangCach').optional().isNumeric().withMessage('Khoảng cách phải là số'),
    body('thoiGianDuKien').optional().notEmpty().withMessage('Thời gian dự kiến là bắt buộc'),
    body('moTa').optional().isLength({ max: 200 }).withMessage('Mô tả tối đa 200 ký tự'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postTuyenXe
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID tuyến xe không hợp lệ'),
    body('diemDi').optional().notEmpty().withMessage('Điểm đi là bắt buộc'),
    body('diemDen').optional().notEmpty().withMessage('Điểm đến là bắt buộc'),
    body('khoangCach').optional().isNumeric().withMessage('Khoảng cách phải là số'),
    body('thoiGianDuKien').optional().notEmpty().withMessage('Thời gian dự kiến là bắt buộc'),
    body('moTa').optional().isLength({ max: 200 }).withMessage('Mô tả tối đa 200 ký tự'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putTuyenXe
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID tuyến xe không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteTuyenXe
);

module.exports = router;
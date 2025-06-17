const express = require('express');
const { body, param } = require('express-validator');
const { getTaiXe, postTaiXe, putTaiXe, deleteTaiXe } = require('../controllers/taiXeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff']), getTaiXe);
router.post(
  '/',
  [
    body('bangLai').notEmpty().withMessage('Bằng lái là bắt buộc'),
    body('cccd').isLength({ max: 12 }).withMessage('CCCD tối đa 12 ký tự'),
    body('hoVaTen').notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('kinhNghiem').isInt({ min: 0 }).withMessage('Kinh nghiệm phải là số không âm'),
    body('ngaySinh').isISO8601().withMessage('Ngày sinh không hợp lệ'),
    body('sdt').matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
  ],
  authMiddleware(['Admin']),
  postTaiXe
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID tài xế không hợp lệ'),
    body('bangLai').optional().notEmpty().withMessage('Bằng lái là bắt buộc'),
    body('cccd').optional().isLength({ max: 12 }).withMessage('CCCD tối đa 12 ký tự'),
    body('hoVaTen').optional().notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('kinhNghiem').optional().isInt({ min: 0 }).withMessage('Kinh nghiệm phải là số không âm'),
    body('ngaySinh').optional().isISO8601().withMessage('Ngày sinh không hợp lệ'),
    body('sdt').optional().matches(/^[0-9]{10,11}$/).withMessage('SĐT phải có 10 hoặc 11 chữ số'),
  ],
  authMiddleware(['Admin']),
  putTaiXe
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID tài xế không hợp lệ'),
  ],
  authMiddleware(['Admin']),
  deleteTaiXe
);

module.exports = router;
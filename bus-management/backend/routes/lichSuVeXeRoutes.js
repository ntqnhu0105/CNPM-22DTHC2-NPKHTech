const express = require('express');
const { body, param } = require('express-validator');
const { getLichSuVeXe, postLichSuVeXe, putLichSuVeXe, deleteLichSuVeXe, getLichSuVeXeByCustomer } = require('../controllers/lichSuVeXeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff', 'Customer']), getLichSuVeXe);
router.post(
  '/',
  [
    body('veXeId').isMongoId().withMessage('ID vé xe không hợp lệ'),
    body('trangThai').isIn(['Booked', 'Paid', 'Cancelled', 'Refunded']).withMessage('Trạng thái không hợp lệ'),
    body('ngayThayDoi').isISO8601().withMessage('Ngày thay đổi không hợp lệ'),
    body('ghiChu').optional().isLength({ max: 200 }).withMessage('Ghi chú tối đa 200 ký tự'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postLichSuVeXe
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID lịch sử vé xe không hợp lệ'),
    body('veXeId').optional().isMongoId().withMessage('ID vé xe không hợp lệ'),
    body('trangThai').optional().isIn(['Booked', 'Paid', 'Cancelled', 'Refunded']).withMessage('Trạng thái không hợp lệ'),
    body('ngayThayDoi').optional().isISO8601().withMessage('Ngày thay đổi không hợp lệ'),
    body('ghiChu').optional().isLength({ max: 200 }).withMessage('Ghi chú tối đa 200 ký tự'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putLichSuVeXe
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID lịch sử vé xe không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteLichSuVeXe
);
router.get('/customer', authMiddleware(['Customer']), getLichSuVeXeByCustomer);

module.exports = router;
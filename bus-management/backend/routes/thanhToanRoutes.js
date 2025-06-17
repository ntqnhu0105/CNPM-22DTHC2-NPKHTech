const express = require('express');
const { body, param } = require('express-validator');
const { getThanhToan, postThanhToan, putThanhToan, deleteThanhToan } = require('../controllers/thanhToanController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff', 'Customer']), getThanhToan);
router.post(
  '/',
  [
    body('khachHangId').isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('nhaXeId').isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('veXeId').isMongoId().withMessage('ID vé xe không hợp lệ'),
    body('phuongThucThanhToan').notEmpty().withMessage('Phương thức thanh toán là bắt buộc'),
    body('soTien').isNumeric().withMessage('Số tiền phải là số'),
    body('trangThai').notEmpty().withMessage('Trạng thái là bắt buộc'),
    body('thoiGianGiaoDich').isISO8601().withMessage('Thời gian giao dịch không hợp lệ'),
    body('paymentGatewayId').optional().isLength({ max: 50 }).withMessage('ID cổng thanh toán tối đa 50 ký tự'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postThanhToan
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID thanh toán không hợp lệ'),
    body('khachHangId').optional().isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('nhaXeId').optional().isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('veXeId').optional().isMongoId().withMessage('ID vé xe không hợp lệ'),
    body('phuongThucThanhToan').optional().notEmpty().withMessage('Phương thức thanh toán là bắt buộc'),
    body('soTien').optional().isNumeric().withMessage('Số tiền phải là số'),
    body('trangThai').optional().notEmpty().withMessage('Trạng thái là bắt buộc'),
    body('thoiGianGiaoDich').optional().isISO8601().withMessage('Thời gian giao dịch không hợp lệ'),
    body('paymentGatewayId').optional().isLength({ max: 50 }).withMessage('ID cổng thanh toán tối đa 50 ký tự'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putThanhToan
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID thanh toán không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteThanhToan
);

module.exports = router;
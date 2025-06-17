const express = require('express');
const { body, param } = require('express-validator');
const { getVeXe, postVeXe, putVeXe, deleteVeXe } = require('../controllers/veXeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff', 'Customer']), getVeXe);
router.post(
  '/',
  [
    body('nhanVienId').isMongoId().withMessage('ID nhân viên không hợp lệ'),
    body('chuyenXeId').isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    body('khachHangId').isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('maSoGhe').notEmpty().withMessage('Mã số ghế là bắt buộc'),
    body('xeId').isMongoId().withMessage('ID xe không hợp lệ'),
    body('ngayDatVe').isISO8601().withMessage('Ngày đặt vé không hợp lệ'),
    body('khuyenMaiId').optional().isMongoId().withMessage('ID khuyến mãi không hợp lệ'),
    body('tongTien').isNumeric().withMessage('Tổng tiền phải là số'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postVeXe
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID vé xe không hợp lệ'),
    body('nhanVienId').optional().isMongoId().withMessage('ID nhân viên không hợp lệ'),
    body('chuyenXeId').optional().isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    body('khachHangId').optional().isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('maSoGhe').optional().notEmpty().withMessage('Mã số ghế là bắt buộc'),
    body('xeId').optional().isMongoId().withMessage('ID xe không hợp lệ'),
    body('ngayDatVe').optional().isISO8601().withMessage('Ngày đặt vé không hợp lệ'),
    body('khuyenMaiId').optional().isMongoId().withMessage('ID khuyến mãi không hợp lệ'),
    body('tongTien').optional().isNumeric().withMessage('Tổng tiền phải là số'),
    body('trangThai').optional().isIn(['Booked', 'Paid', 'Cancelled', 'Refunded']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putVeXe
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID vé xe không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteVeXe
);

module.exports = router;
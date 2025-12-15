const express = require('express');
const { body, param } = require('express-validator');
const { 
  getVeXe, postVeXe, getMyTickets, postVeXeAdmin, putVeXe, deleteVeXe, 
  bookVeXe, getAvailableSeats, payVeXeController, cancelVeXeController 
} = require('../controllers/veXeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-tickets', authMiddleware(['Customer']), getMyTickets);
router.get('/', authMiddleware(['Admin', 'Staff', 'Customer']), getVeXe);
// Route cho admin/staff tạo vé xe
router.post(
  '/admin',
  [
    body('nhanVienId').optional().isMongoId().withMessage('ID nhân viên không hợp lệ'),
    body('chuyenXeId').isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    body('khachHangId').isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('maSoGhe').notEmpty().withMessage('Mã số ghế là bắt buộc'),
    body('xeId').isMongoId().withMessage('ID xe không hợp lệ'),
    body('ngayDatVe').isISO8601().withMessage('Ngày đặt vé không hợp lệ'),
    body('khuyenMaiId').optional().isMongoId().withMessage('ID khuyến mãi không hợp lệ'),
    body('tongTien').isNumeric().withMessage('Tổng tiền phải là số'),
    body('trangThai').optional().isIn(['Booked', 'Paid', 'Cancelled', 'Refunded']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postVeXeAdmin
);

// Route cho customer đặt vé
router.post(
  '/',
  [
    body('chuyenXeId').isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    body('maSoGhe').notEmpty().withMessage('Mã số ghế là bắt buộc'),
    body('xeId').isMongoId().withMessage('ID xe không hợp lệ'),
    body('phuongThucThanhToan').notEmpty().withMessage('Phương thức thanh toán là bắt buộc'),
    body('diaChiDon').notEmpty().withMessage('Địa chỉ đón là bắt buộc'),
    body('diaChiTra').notEmpty().withMessage('Địa chỉ trả là bắt buộc'),
    body('thongTinKhachHang.hoVaTen').notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('thongTinKhachHang.soDienThoai').notEmpty().withMessage('Số điện thoại là bắt buộc'),
    body('thongTinKhachHang.email').isEmail().withMessage('Email không hợp lệ'),
  ],
  authMiddleware(['Customer']),
  require('../controllers/veXeController').postVeXe
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
router.post(
  '/book',
  [
    body('chuyenXeId').isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    body('maSoGhe').notEmpty().withMessage('Mã số ghế là bắt buộc'),
    body('khuyenMaiId').optional().isMongoId().withMessage('ID khuyến mãi không hợp lệ'),
  ],
  authMiddleware(['Customer']),
  bookVeXe
);
router.get(
    '/:chuyenXeId/seats',
    [
        param('chuyenXeId').isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    ],
    authMiddleware(['Customer']),
    getAvailableSeats
);

// Thanh toán vé (Pay) - Customer
router.post(
  '/:id/pay',
  [
    param('id').isMongoId().withMessage('ID vé xe không hợp lệ'),
    body('phuongThucThanhToan').notEmpty().withMessage('Phương thức thanh toán là bắt buộc'),
    body('diaChiDon').notEmpty().withMessage('Địa chỉ đón là bắt buộc'),
    body('diaChiTra').notEmpty().withMessage('Địa chỉ trả là bắt buộc'),
    body('thongTinKhachHang.hoVaTen').notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('thongTinKhachHang.soDienThoai').notEmpty().withMessage('Số điện thoại là bắt buộc'),
    body('thongTinKhachHang.email').isEmail().withMessage('Email không hợp lệ'),
    body('captchaText').notEmpty().withMessage('Captcha là bắt buộc')
  ],
  authMiddleware(['Customer']),
  payVeXeController
);

// Hủy vé (Cancel) - Customer
router.post(
  '/:id/cancel',
  [
    param('id').isMongoId().withMessage('ID vé xe không hợp lệ'),
    body('lyDoHuy').optional().isLength({ max: 200 }).withMessage('Lý do hủy tối đa 200 ký tự')
  ],
  authMiddleware(['Customer']),
  cancelVeXeController
);

module.exports = router;
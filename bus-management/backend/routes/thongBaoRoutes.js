const express = require('express');
const { body, param } = require('express-validator');
const { getThongBao, postThongBao, putThongBao, deleteThongBao, markThongBaoAsRead, markAllThongBaoAsRead, toggleThongBaoImportant } = require('../controllers/thongBaoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff', 'Customer']), getThongBao);
router.post(
  '/',
  [
    body('khachHangId').isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('tieuDe').notEmpty().withMessage('Tiêu đề là bắt buộc'),
    body('noiDung').notEmpty().withMessage('Nội dung là bắt buộc'),
    body('ngayGui').isISO8601().withMessage('Ngày gửi không hợp lệ'),
    body('trangThai').optional().isIn(['Sent', 'Read']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postThongBao
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID thông báo không hợp lệ'),
    body('khachHangId').optional().isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('tieuDe').optional().notEmpty().withMessage('Tiêu đề là bắt buộc'),
    body('noiDung').optional().notEmpty().withMessage('Nội dung là bắt buộc'),
    body('ngayGui').optional().isISO8601().withMessage('Ngày gửi không hợp lệ'),
    body('trangThai').optional().isIn(['Sent', 'Read']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putThongBao
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID thông báo không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteThongBao
);

router.patch(
  '/:id/read',
  [param('id').isMongoId().withMessage('ID thông báo không hợp lệ')],
  authMiddleware(['Customer']),
  markThongBaoAsRead
);

router.patch(
  '/read-all',
  [body('khachHangId').isMongoId().withMessage('ID khách hàng không hợp lệ')],
  authMiddleware(['Customer']),
  markAllThongBaoAsRead
);

router.patch(
  '/:id/important',
  [param('id').isMongoId().withMessage('ID thông báo không hợp lệ')],
  authMiddleware(['Customer']),
  toggleThongBaoImportant
);

module.exports = router;
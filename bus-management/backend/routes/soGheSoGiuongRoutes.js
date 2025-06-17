const express = require('express');
const { body, param } = require('express-validator');
const { getSoGheSoGiuong, postSoGheSoGiuong, putSoGheSoGiuong, deleteSoGheSoGiuong } = require('../controllers/soGheSoGiuongController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff']), getSoGheSoGiuong);
router.post(
  '/',
  [
    body('maSoGhe').notEmpty().withMessage('Mã số ghế là bắt buộc'),
    body('xeId').isMongoId().withMessage('ID xe không hợp lệ'),
    body('trangThai').optional().isIn(['Available', 'Booked']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postSoGheSoGiuong
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID số ghế/số giường không hợp lệ'),
    body('maSoGhe').optional().notEmpty().withMessage('Mã số ghế là bắt buộc'),
    body('xeId').optional().isMongoId().withMessage('ID xe không hợp lệ'),
    body('trangThai').optional().isIn(['Available', 'Booked']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putSoGheSoGiuong
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID số ghế/số giường không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteSoGheSoGiuong
);

module.exports = router;
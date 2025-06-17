const express = require('express');
const { body, param } = require('express-validator');
const { getCSKH, postCSKH, putCSKH, deleteCSKH } = require('../controllers/cskhController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'Staff']), getCSKH);
router.post(
  '/',
  [
    body('khachHangId').isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('nhaXeId').isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('moTa').notEmpty().withMessage('Mô tả là bắt buộc'),
    body('ngayCSKH').isISO8601().withMessage('Ngày CSKH không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postCSKH
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID CSKH không hợp lệ'),
    body('khachHangId').optional().isMongoId().withMessage('ID khách hàng không hợp lệ'),
    body('nhaXeId').optional().isMongoId().withMessage('ID nhà xe không hợp lệ'),
    body('moTa').optional().notEmpty().withMessage('Mô tả là bắt buộc'),
    body('ngayCSKH').optional().isISO8601().withMessage('Ngày CSKH không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putCSKH
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID CSKH không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteCSKH
);

module.exports = router;
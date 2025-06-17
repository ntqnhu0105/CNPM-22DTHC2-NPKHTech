const express = require('express');
const { body, param } = require('express-validator');
const { getChuyenXe, postChuyenXe, putChuyenXe, deleteChuyenXe } = require('../controllers/chuyenXeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getChuyenXe);
router.post(
  '/',
  [
    body('tuyenXeId').isMongoId().withMessage('ID tuyến xe không hợp lệ'),
    body('xeId').isMongoId().withMessage('ID xe không hợp lệ'),
    body('taiXeId').isMongoId().withMessage('ID tài xế không hợp lệ'),
    body('gia').isNumeric().withMessage('Giá phải là số'),
    body('thoiGianKhoiHanh').isISO8601().withMessage('Thời gian khởi hành không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  postChuyenXe
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID chuyến xe không hợp lệ'),
    body('tuyenXeId').optional().isMongoId().withMessage('ID tuyến xe không hợp lệ'),
    body('xeId').optional().isMongoId().withMessage('ID xe không hợp lệ'),
    body('taiXeId').optional().isMongoId().withMessage('ID tài xế không hợp lệ'),
    body('gia').optional().isNumeric().withMessage('Giá phải là số'),
    body('thoiGianKhoiHanh').optional().isISO8601().withMessage('Thời gian khởi hành không hợp lệ'),
    body('trangThaiChuyen').optional().isIn(['Pending', 'Running', 'Completed', 'Cancelled']).withMessage('Trạng thái không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  putChuyenXe
);
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID chuyến xe không hợp lệ'),
  ],
  authMiddleware(['Admin', 'Staff']),
  deleteChuyenXe
);

module.exports = router;
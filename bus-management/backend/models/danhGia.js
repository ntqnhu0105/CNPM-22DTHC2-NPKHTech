const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DanhGiaSchema = new Schema({
  khachHangId: { type: Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  chuyenXeId: { type: Schema.Types.ObjectId, ref: 'ChuyenXe', default: null },
  nhaXeId: { type: Schema.Types.ObjectId, ref: 'NhaXe', required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: { type: String, maxlength: 500 },
  ngayDanhGia: { type: Date, required: true }
});

module.exports = mongoose.model('DanhGia', DanhGiaSchema);
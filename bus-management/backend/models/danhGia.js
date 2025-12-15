const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DanhGiaSchema = new Schema({
  khachHangId: { type: Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  chuyenXeId: { type: Schema.Types.ObjectId, ref: 'ChuyenXe', required: true },
  nhaXeId: { type: Schema.Types.ObjectId, ref: 'NhaXe', required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: { type: String, maxlength: 500, trim: true },
  ngayDanhGia: { type: Date, default: Date.now }
}, { timestamps: true });

DanhGiaSchema.index({ nhaXeId: 1 });
DanhGiaSchema.index({ chuyenXeId: 1 });
DanhGiaSchema.index({ khachHangId: 1 });

module.exports = mongoose.model('DanhGia', DanhGiaSchema);
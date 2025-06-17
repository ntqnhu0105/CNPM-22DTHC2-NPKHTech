const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CSKHSchema = new Schema({
  khachHangId: { type: Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  nhaXeId: { type: Schema.Types.ObjectId, ref: 'NhaXe', required: true },
  moTa: { type: String, required: true, maxlength: 50 },
  ngayCSKH: { type: Date, required: true }
});

CSKHSchema.index({ khachHangId: 1 });
CSKHSchema.index({ nhaXeId: 1 });

module.exports = mongoose.model('CSKH', CSKHSchema);
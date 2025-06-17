const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhanVienSchema = new Schema({
  cccd: { type: String, required: true, maxlength: 12 },
  diaChi: { type: String, maxlength: 100 },
  email: { type: String, maxlength: 50 },
  hoVaTen: { type: String, required: true, maxlength: 50 },
  nhaXeId: { type: Schema.Types.ObjectId, ref: 'NhaXe', required: true },
  ngaySinh: { type: Date },
  sdt: { type: String, required: true, maxlength: 11 }
});

NhanVienSchema.index({ nhaXeId: 1 });

module.exports = mongoose.model('NhanVien', NhanVienSchema);
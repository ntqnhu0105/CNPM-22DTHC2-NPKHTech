const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TuyenXeSchema = new Schema({
  diemDi: { type: String, required: true, maxlength: 100 },
  diemDen: { type: String, required: true, maxlength: 100 },
  khoangCach: { type: Number },
  thoiGianDuKien: { type: String },
  moTa: { type: String, maxlength: 200 }
});

module.exports = mongoose.model('TuyenXe', TuyenXeSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaiXeSchema = new Schema({
  bangLai: { type: String, required: true, maxlength: 12 },
  cccd: { type: String, required: true, maxlength: 12 },
  hoVaTen: { type: String, required: true, maxlength: 50 },
  kinhNghiem: { type: Number, required: true },
  ngaySinh: { type: Date, required: true },
  sdt: { type: String, required: true, maxlength: 11 }
});

module.exports = mongoose.model('TaiXe', TaiXeSchema);
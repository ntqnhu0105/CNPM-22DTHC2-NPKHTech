const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoaiXeSchema = new Schema({
  moTa: { type: String, maxlength: 100 },
  tenLoai: { type: String, required: true, maxlength: 50 }
});

module.exports = mongoose.model('LoaiXe', LoaiXeSchema);
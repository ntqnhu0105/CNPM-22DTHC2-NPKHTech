const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhaXeSchema = new Schema({
  diaChi: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 50 },
  sdt: { type: String, required: true, maxlength: 11 },
  tenNhaXe: { type: String, required: true, maxlength: 50 }
});

module.exports = mongoose.model('NhaXe', NhaXeSchema);
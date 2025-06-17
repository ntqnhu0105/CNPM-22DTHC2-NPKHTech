const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThongBaoSchema = new Schema({
  khachHangId: { type: Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  tieuDe: { type: String, required: true, maxlength: 100 },
  noiDung: { type: String, required: true, maxlength: 500 },
  ngayGui: { type: Date, required: true },
  trangThai: {
    type: String,
    default: 'Sent',
    enum: ['Sent', 'Read']
  }
});

module.exports = mongoose.model('ThongBao', ThongBaoSchema);
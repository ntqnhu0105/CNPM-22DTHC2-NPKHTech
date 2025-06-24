const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThanhToanSchema = new Schema({
  khachHangId: { type: Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  nhaXeId: { type: Schema.Types.ObjectId, ref: 'NhaXe', required: true },
  veXeId: { type: Schema.Types.ObjectId, ref: 'VeXe', required: true },
  phuongThucThanhToan: { type: String, required: true, maxlength: 50 },
  soTien: { type: Number, required: true },
  trangThai: { type: String, required: true, maxlength: 20 },
  thoiGianGiaoDich: { type: Date, required: true },
  paymentGatewayId: { type: String, maxlength: 50 },
  diaChiDon: { type: String, maxlength: 200 },
  diaChiTra: { type: String, maxlength: 200 },
  thongTinKhachHang: {
    hoVaTen: String,
    soDienThoai: String,
    email: String
  }
});

ThanhToanSchema.index({ khachHangId: 1 });
ThanhToanSchema.index({ nhaXeId: 1 });
ThanhToanSchema.index({ veXeId: 1 });
ThanhToanSchema.index({ thoiGianGiaoDich: 1 });

module.exports = mongoose.model('ThanhToan', ThanhToanSchema);
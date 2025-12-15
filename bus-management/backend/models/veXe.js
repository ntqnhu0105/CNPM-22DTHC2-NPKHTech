const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VeXeSchema = new Schema({
  nhanVienId: { type: Schema.Types.ObjectId, ref: 'NhanVien', default: null },
  chuyenXeId: { type: Schema.Types.ObjectId, ref: 'ChuyenXe', required: true },
  khachHangId: { type: Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  maSoGhe: { type: String, required: true, maxlength: 10 },
  xeId: { type: Schema.Types.ObjectId, ref: 'Xe', required: true },
  ngayDatVe: { type: Date, required: true },
  khuyenMaiId: { type: Schema.Types.ObjectId, ref: 'KhuyenMai', default: null },
  tongTien: { type: Number, required: true },
  trangThai: {
    type: String,
    default: 'Booked',
    enum: ['Booked', 'Paid', 'Cancelled', 'Refunded', 'Deleted']
  },
  phuongThucThanhToan: { type: String, maxlength: 50 },
  diaChiDon: { type: String, maxlength: 200 },
  diaChiTra: { type: String, maxlength: 200 },
  thongTinKhachHang: {
    hoVaTen: String,
    soDienThoai: String,
    email: String
  }
});

VeXeSchema.index({ nhanVienId: 1 });
VeXeSchema.index({ chuyenXeId: 1 });
VeXeSchema.index({ khachHangId: 1 });
VeXeSchema.index({ chuyenXeId: 1, maSoGhe: 1 });
VeXeSchema.index({ ngayDatVe: 1 });

module.exports = mongoose.model('VeXe', VeXeSchema);
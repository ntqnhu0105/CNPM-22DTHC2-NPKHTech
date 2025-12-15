const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KhuyenMaiSchema = new Schema({
  tenKhuyenMai: { type: String, required: true, maxlength: 100 },
  phanTramGiamGia: { type: Number, required: true, min: 0, max: 100 },
  ngayBatDau: { type: Date, required: true },
  ngayKetThuc: { 
  type: Date, 
  required: true,
  validate: {
    validator: function(v) {
      return this.ngayBatDau <= v;
    },
    message: 'Ngày kết thúc phải sau ngày bắt đầu.'
  }
},
  trangThai: { 
    type: String, 
    default: 'Active', 
    enum: ['Active', 'Inactive', 'Expired'] 
  }
});

module.exports = mongoose.model('KhuyenMai', KhuyenMaiSchema);
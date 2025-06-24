const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KhachHangSchema = new Schema({
  cccd: { 
    type: String, 
    required: true, 
    maxlength: 12,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{12}$/.test(v);
      },
      message: 'CCCD phải có đúng 12 chữ số.'
    }
  },
  email: { 
    type: String, 
    required: true, 
    maxlength: 50,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email không hợp lệ.'
    }
  },
  hoVaTen: { 
    type: String, 
    required: true, 
    maxlength: 50 
  },
  sdt: {
    type: String,
    required: true,
    maxlength: 11,
    validate: {
      validator: function(v) {
        return /^[0-9]{10,11}$/.test(v);
      },
      message: 'SĐT phải có 10 hoặc 11 chữ số.'
    }
  },
  diaChi: { 
    type: String, 
    maxlength: 100 
  },
  ngaySinh: { 
    type: Date 
  }
}, {
  timestamps: true
});

// Index để tối ưu truy vấn
KhachHangSchema.index({ cccd: 1 });
KhachHangSchema.index({ email: 1 });
KhachHangSchema.index({ sdt: 1 });

module.exports = mongoose.model('KhachHang', KhachHangSchema);
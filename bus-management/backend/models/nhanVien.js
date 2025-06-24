const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhanVienSchema = new Schema({
  cccd: { 
    type: String, 
    required: true, 
    maxlength: 12,
    validate: {
      validator: function(v) {
        return /^[0-9]{12}$/.test(v);
      },
      message: 'CCCD phải có đúng 12 chữ số.'
    }
  },
  diaChi: { 
    type: String, 
    maxlength: 100 
  },
  email: { 
    type: String, 
    maxlength: 50,
    validate: {
      validator: function(v) {
        if (!v) return true; // Email không bắt buộc
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
  nhaXeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'NhaXe',
    required: true
  },
  ngaySinh: { 
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true; // Ngày sinh không bắt buộc
        return v instanceof Date && !isNaN(v);
      },
      message: 'Ngày sinh không hợp lệ.'
    }
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
  chucVu: {
    type: String,
    required: true,
    enum: ['Quản lý', 'Tài xế', 'Phụ xe', 'Nhân viên bán vé'],
    default: 'Nhân viên bán vé',
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  }
}, {
  timestamps: true
});

// Indexes để tối ưu truy vấn
NhanVienSchema.index({ nhaXeId: 1 });
NhanVienSchema.index({ cccd: 1 });
NhanVienSchema.index({ email: 1 });
NhanVienSchema.index({ sdt: 1 });
NhanVienSchema.index({ chucVu: 1 });
NhanVienSchema.index({ userId: 1 });

module.exports = mongoose.model('NhanVien', NhanVienSchema);
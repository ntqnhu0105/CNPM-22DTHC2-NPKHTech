const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KhachHangSchema = new Schema({
  email: { type: String, required: true, maxlength: 50 },
  hoVaTen: { type: String, required: true, maxlength: 50 },
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
  }
});

module.exports = mongoose.model('KhachHang', KhachHangSchema);
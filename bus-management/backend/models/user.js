const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, maxlength: 50 },
  passwordHash: { type: String, required: true, maxlength: 256 },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Staff', 'Customer']
  },
  khachHangId: { type: Schema.Types.ObjectId, ref: 'KhachHang', default: null },
  nhanVienId: { type: Schema.Types.ObjectId, ref: 'NhanVien', default: null },
  lastLogin: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
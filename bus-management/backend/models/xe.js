const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const XeSchema = new Schema({
  bienSoXe: { type: String, required: true, maxlength: 12, unique: true },
  loaiXeId: { type: Schema.Types.ObjectId, ref: 'LoaiXe', required: true },
  nhaXeId: { type: Schema.Types.ObjectId, ref: 'NhaXe', required: true },
  soGhe: { type: Number, required: true },
  trangThai: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Inactive']
  }
});

XeSchema.index({ loaiXeId: 1 });
XeSchema.index({ nhaXeId: 1 });

module.exports = mongoose.model('Xe', XeSchema);
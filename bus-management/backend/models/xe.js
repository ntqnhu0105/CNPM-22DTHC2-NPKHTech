const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const XeSchema = new Schema({
  bienSoXe: { type: String, required: true, maxlength: 12 },
  loaiXeId: { type: Schema.Types.ObjectId, ref: 'LoaiXe', required: true },
  nhaXeId: { type: Schema.Types.ObjectId, ref: 'NhaXe', required: true },
  soLuongGhe: { type: Number, required: true }
});

XeSchema.index({ loaiXeId: 1 });
XeSchema.index({ nhaXeId: 1 });

module.exports = mongoose.model('Xe', XeSchema);
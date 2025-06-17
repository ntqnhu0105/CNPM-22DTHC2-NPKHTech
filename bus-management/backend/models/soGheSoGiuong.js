const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoGheSoGiuongSchema = new Schema({
  maSoGhe: { type: String, required: true, maxlength: 10 },
  xeId: { type: Schema.Types.ObjectId, ref: 'Xe', required: true },
  trangThai: {
    type: String,
    default: 'Available',
    enum: ['Available', 'Booked']
  }
});

SoGheSoGiuongSchema.index({ xeId: 1 });
SoGheSoGiuongSchema.index({ maSoGhe: 1, xeId: 1 }, { unique: true });

module.exports = mongoose.model('SoGheSoGiuong', SoGheSoGiuongSchema);
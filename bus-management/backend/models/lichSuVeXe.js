const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LichSuVeXeSchema = new Schema({
  veXeId: { type: Schema.Types.ObjectId, ref: 'VeXe', required: true },
  trangThai: {
    type: String,
    required: true,
    enum: ['Booked', 'Paid', 'Cancelled', 'Refunded']
  },
  ngayThayDoi: { type: Date, required: true },
  ghiChu: { type: String, maxlength: 200 }
});

module.exports = mongoose.model('LichSuVeXe', LichSuVeXeSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChuyenXeSchema = new Schema({
  tuyenXeId: { type: Schema.Types.ObjectId, ref: 'TuyenXe', required: true },
  gia: { type: Number, required: true },
  thoiGianKhoiHanh: { type: Date, required: true },
  xeId: { type: Schema.Types.ObjectId, ref: 'Xe', required: true },
  taiXeId: { type: Schema.Types.ObjectId, ref: 'TaiXe', required: true },
  trangThaiChuyen: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Running', 'Completed', 'Cancelled']
  }
});

ChuyenXeSchema.index({ xeId: 1 });
ChuyenXeSchema.index({ thoiGianKhoiHanh: 1 });

module.exports = mongoose.model('ChuyenXe', ChuyenXeSchema);
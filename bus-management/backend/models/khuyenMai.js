const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KhuyenMaiSchema = new Schema({
  nhaXeId: { type: Schema.Types.ObjectId, ref: 'NhaXe', required: true },
  code: { type: String, required: true, unique: true, maxlength: 20 },
  discount: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  maxUsage: { type: Number },
  usageCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('KhuyenMai', KhuyenMaiSchema);
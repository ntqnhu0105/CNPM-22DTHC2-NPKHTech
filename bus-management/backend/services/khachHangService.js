const { KhachHang } = require('../models');

const getAllKhachHang = async () => {
  return await KhachHang.find();
};

const createKhachHang = async (data) => {
  const khachHang = new KhachHang(data);
  return await khachHang.save();
};

module.exports = {
  getAllKhachHang,
  createKhachHang,
};
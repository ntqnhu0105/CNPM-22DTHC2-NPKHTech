const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('Kết nối MongoDB thành công');
  } catch (err) {
    console.error('Lỗi kết nối MongoDB:', err.message);
    // Thử lại sau 5 giây
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
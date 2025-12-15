const cron = require('node-cron');
const { VeXe, SoGheSoGiuong, LichSuVeXe } = require('../models');

const startCronJobs = () => {
  // Chạy mỗi phút 1 lần (* * * * *)
  cron.schedule('* * * * *', async () => {
    console.log('--- CRON: Quét vé quá hạn thanh toán ---');
    
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Tìm các vé đang Booked mà quá hạn
    const expiredTickets = await VeXe.find({
      trangThai: 'Booked',
      ngayDatVe: { $lt: fifteenMinutesAgo }
    });

    for (const ticket of expiredTickets) {
      // 1. Đổi trạng thái vé
      ticket.trangThai = 'Cancelled';
      await ticket.save();

      // 2. Trả lại ghế trống
      await SoGheSoGiuong.findOneAndUpdate(
        { maSoGhe: ticket.maSoGhe, xeId: ticket.xeId },
        { trangThai: 'Available' }
      );

      // 3. Ghi log
      await new LichSuVeXe({
        veXeId: ticket._id,
        trangThai: 'Cancelled',
        ngayThayDoi: new Date(),
        ghiChu: 'Hủy tự động do quá hạn thanh toán (System Cron)'
      }).save();
      
      console.log(`Đã hủy vé quá hạn: ${ticket._id}`);
    }
  });
};

module.exports = startCronJobs;
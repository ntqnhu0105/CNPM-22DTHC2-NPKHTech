<template>
  <div class="card">
    <div class="card-header">
      <h3>Danh sách vé xe</h3>
    </div>
    <div class="card-body">
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Chuyến xe</th>
            <th>Khách hàng</th>
            <th>Mã số ghế</th>
            <th>Xe</th>
            <th>Ngày đặt vé</th>
            <th>Khuyến mãi</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="veXe in store.veXes" :key="veXe._id">
            <td>{{ veXe.nhanVienId?.hoVaTen || 'N/A' }}</td>
            <td>{{ veXe.chuyenXeId?.tuyenXeId?.diemDi }} - {{ veXe.chuyenXeId?.tuyenXeId?.diemDen }}</td>
            <td>{{ veXe.khachHangId?.hoVaTen || 'N/A' }}</td>
            <td>{{ veXe.maSoGhe }}</td>
            <td>{{ veXe.xeId?.bienSoXe || 'N/A' }}</td>
            <td>{{ new Date(veXe.ngayDatVe).toLocaleString('vi-VN') }}</td>
            <td>{{ veXe.khuyenMaiId?.tenKhuyenMai || 'Không có' }}</td>
            <td>{{ veXe.tongTien.toLocaleString('vi-VN') }} VNĐ</td>
            <td>
              <span :class="getStatusClass(veXe.trangThai)">{{ veXe.trangThai }}</span>
            </td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="$emit('edit', veXe)">Sửa</button>
              <button class="btn btn-sm btn-danger me-2" @click="store.deleteVeXe(veXe._id)">Xóa</button>
              <button v-if="['Booked','Paid'].includes(veXe.trangThai)" class="btn btn-sm btn-outline-danger" @click="onCancel(veXe)">Hủy vé</button>
              <button v-if="veXe.trangThai === 'Booked'" class="btn btn-sm btn-success ms-2" @click="openPayModal(veXe)">Thanh toán</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchVeXes(store.pagination.page - 1)">Trước</a>
          </li>
          <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
            <a class="page-link" @click="store.fetchVeXes(n)">{{ n }}</a>
          </li>
          <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
            <a class="page-link" @click="store.fetchVeXes(store.pagination.page + 1)">Sau</a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- Modal Thanh toán -->
    <div class="modal fade" id="payModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thanh toán vé xe</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitPayForm">
              <div class="mb-3">
                <label class="form-label">Phương thức thanh toán</label>
                <select v-model="payForm.phuongThucThanhToan" class="form-control" required>
                  <option value="">Chọn phương thức</option>
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                  <option value="Ví điện tử">Ví điện tử</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Số tiền (VNĐ)</label>
                <input v-model.number="payForm.soTien" type="number" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Ngày thanh toán</label>
                <input v-model="payForm.thoiGianGiaoDich" type="datetime-local" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Ghi chú</label>
                <input v-model="payForm.ghiChu" type="text" class="form-control" />
              </div>
              <button type="submit" class="btn btn-primary w-100">Xác nhận thanh toán</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVeXeStore } from '../stores/veXe';
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const store = useVeXeStore();
const toast = useToast();

const payForm = ref({
  veXeId: '',
  phuongThucThanhToan: '',
  soTien: 0,
  thoiGianGiaoDich: '',
  ghiChu: ''
});
let payModalInstance = null;

const openPayModal = (veXe) => {
  payForm.value = {
    veXeId: veXe._id,
    phuongThucThanhToan: 'Tiền mặt',
    soTien: veXe.tongTien,
    thoiGianGiaoDich: new Date().toISOString().slice(0, 16),
    ghiChu: ''
  };
  const modalElement = document.getElementById('payModal');
  if (modalElement) {
    payModalInstance = new Modal(modalElement);
    payModalInstance.show();
  }
};

const submitPayForm = async () => {
  try {
    // Gọi API tạo thanh toán với dữ liệu đầy đủ
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/thanhtoan`, {
      veXeId: payForm.value.veXeId,
      phuongThucThanhToan: payForm.value.phuongThucThanhToan,
      soTien: payForm.value.soTien,
      thoiGianGiaoDich: payForm.value.thoiGianGiaoDich,
      trangThai: 'Success',
      ghiChu: payForm.value.ghiChu
    });

    toast.success('Thanh toán thành công! Vé đã được cập nhật trạng thái.');
    payModalInstance.hide();
    store.fetchVeXes(); // Refresh danh sách vé
  } catch (error) {
    console.error('Lỗi thanh toán:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi thực hiện thanh toán');
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Booked': return 'badge bg-warning';
    case 'Paid': return 'badge bg-success';
    case 'Cancelled': return 'badge bg-danger';
    case 'Refunded': return 'badge bg-info';
    default: return 'badge bg-secondary';
  }
};

const onCancel = (veXe) => {
  if (confirm('Bạn có chắc chắn muốn hủy vé này?')) {
    store.cancelVeXe(veXe._id);
  }
};

store.fetchVeXes();
</script> 
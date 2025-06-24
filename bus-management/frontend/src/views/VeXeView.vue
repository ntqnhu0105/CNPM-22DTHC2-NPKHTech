<template>
  <DefaultLayout>
    <section class="xe-header">
      <div class="xe-header-left">
        <i class="bi bi-ticket-detailed xe-header-icon"></i>
        <div>
          <h1 class="xe-title">Quản lý vé xe</h1>
          <p class="xe-desc">Tạo, chỉnh sửa và quản lý vé xe dễ dàng.</p>
        </div>
      </div>
      <button class="xe-btn" data-bs-toggle="modal" data-bs-target="#createModal">
        <i class="bi bi-plus-lg"></i>
        <span>Tạo vé xe</span>
      </button>
    </section>
    <section class="xe-content-card">
      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-else class="table-responsive">
        <table class="table xe-table mb-0">
          <thead>
            <tr>
              <th class="highlight-text">Nhân viên</th>
              <th class="highlight-text">Chuyến xe</th>
              <th class="highlight-text">Khách hàng</th>
              <th class="highlight-text">Mã số ghế</th>
              <th class="highlight-text">Xe</th>
              <th class="highlight-text">Ngày đặt vé</th>
              <th class="highlight-text">Khuyến mãi</th>
              <th class="highlight-text">Tổng tiền</th>
              <th class="highlight-text">Trạng thái</th>
              <th class="text-center highlight-text">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="veXe in store.veXes" :key="veXe._id" class="table-row-hover">
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
              <td class="action-buttons text-center">
                <button class="action-btn text-edit-btn me-2" @click="openEditModal(veXe)">Sửa</button>
                <button class="action-btn text-delete-btn me-2" @click="confirmDelete(veXe._id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <nav class="mt-4">
          <ul class="pagination justify-content-center xe-pagination">
            <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
              <a class="page-link" @click="store.fetchVeXes(store.pagination.page - 1)"><i class="bi bi-chevron-left"></i> Trước</a>
            </li>
            <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
              <a class="page-link" @click="store.fetchVeXes(n)">{{ n }}</a>
            </li>
            <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
              <a class="page-link" @click="store.fetchVeXes(store.pagination.page + 1)">Sau <i class="bi bi-chevron-right"></i></a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
    
    <!-- Create Modal -->
    <VeXeForm :modal-id="'createModal'" @saved="refreshList" />
    
    <!-- Edit Modal -->
    <VeXeForm :modal-id="'editModal'" :ve-xe="selectedVeXe" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import VeXeForm from '../components/VeXeForm.vue';
import { useVeXeStore } from '../stores/veXe';
import { Modal } from 'bootstrap';

const store = useVeXeStore();
const selectedVeXe = ref(null);

const openEditModal = (veXe) => {
  selectedVeXe.value = veXe;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const confirmDelete = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa vé xe này?')) {
    try {
      await store.deleteVeXe(id);
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  }
};

const refreshList = () => {
  store.fetchVeXes();
  selectedVeXe.value = null;
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

store.fetchVeXes();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
body {
  font-family: 'Inter', sans-serif;
  background: #1A202C;
  color: #dde6ed;
}
.xe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.xe-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.xe-header-icon {
  font-size: 2.2rem;
  color: #ffffff;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.xe-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.xe-desc {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
}
.xe-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1A202C;
  color: #fff;
  border: 1.5px solid #ffffff;
  border-radius: 0.7rem;
  padding: 0.7rem 1.4rem;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.xe-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.xe-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
.xe-table {
  border-radius: 1.2rem;
  overflow: hidden;
  background: transparent;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.05);
}
.xe-table thead tr {
  background: linear-gradient(90deg, #5a5fcc 0%, #5190e0 100%);
}
.xe-table th {
  color: #000000;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  padding: 1.1rem 1rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  vertical-align: middle;
}
.highlight-text {
  color: #DDE6ED;
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.3);
}
.xe-table td {
  vertical-align: middle;
  font-size: 0.98rem;
  border-color: #2D3748;
  padding: 1rem 1rem;
  background: transparent;
  color: #dde6ed;
}
.table-row-hover:hover {
  background: #1A202C !important;
  transition: background 0.2s ease-in-out;
}
.action-buttons {
  white-space: nowrap;
}
.action-btn {
  border-radius: 0.5rem;
  padding: 0.6em 1.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.2rem;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.text-edit-btn {
  background: #1A202C;
  color: #60A5FA;
  border: 1px solid #363b53;
}
.text-edit-btn:hover {
  background: #2d3650;
  color: #a5b4fc;
}
.text-delete-btn {
  background: #3b1d1d;
  color: #EF4444;
  border: 1px solid #5a2e2e;
}
.text-delete-btn:hover {
  background: #7f1d1d;
  color: #fee2e2;
}
.xe-pagination .page-item .page-link {
  border-radius: 0.75rem !important;
  margin: 0 0.25em;
  color: #6366f1;
  font-weight: 600;
  background: #1A202C;
  border: 1.5px solid #363b53;
  transition: all 0.2s ease;
  padding: 0.6em 1em;
  min-width: 2.5em;
  text-align: center;
}
.xe-pagination .page-item.active .page-link,
.xe-pagination .page-item .page-link:hover {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
}
.xe-pagination .page-item.disabled .page-link {
  background: #1A202C;
  color: #6b7280;
  border-color: #2D3748;
  cursor: not-allowed;
  opacity: 0.6;
}
@media (max-width: 768px) {
  .xe-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .xe-header-left { gap: 0.7rem; }
  .xe-title { font-size: 1.3rem; }
  .xe-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .xe-content-card { padding: 1rem 0.5rem; }
}
</style> 
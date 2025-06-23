```vue
<template>
  <DefaultLayout>
    <section class="cusdash-header-section">
      <div class="cusdash-header-main-row">
        <div class="cusdash-header-top">
          <i class="bi bi-ticket-detailed cusdash-header-icon"></i>
          <div>
            <h1 class="cusdash-title">Lịch sử vé xe</h1>
            <p class="cusdash-desc">Xem danh sách các vé xe đã đặt và trạng thái của chúng.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="cusdash-results">
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="lichSuVeXes.length === 0" class="alert alert-info cusdash-empty">
        Không có lịch sử vé xe.
      </div>
      <div v-else class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Mã vé</th>
              <th>Mã số ghế</th>
              <th>Trạng thái</th>
              <th>Ngày thay đổi</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lichSu in lichSuVeXes" :key="lichSu._id">
              <td>{{ lichSu.veXeId?._id }}</td>
              <td>{{ lichSu.veXeId?.maSoGhe }}</td>
              <td>
                <span :class="getStatusClass(lichSu.trangThai)">{{ lichSu.trangThai }}</span>
              </td>
              <td>{{ new Date(lichSu.ngayThayDoi).toLocaleString('vi-VN') }}</td>
              <td>{{ lichSu.ghiChu || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <nav v-if="pagination.total > pagination.limit">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: pagination.page === 1 }">
              <a class="page-link" @click="fetchLichSuVeXe(pagination.page - 1)">Trước</a>
            </li>
            <li class="page-item" v-for="p in pageRange" :key="p" :class="{ active: p === pagination.page }">
              <a class="page-link" @click="fetchLichSuVeXe(p)">{{ p }}</a>
            </li>
            <li class="page-item" :class="{ disabled: pagination.page === totalPages }">
              <a class="page-link" @click="fetchLichSuVeXe(pagination.page + 1)">Sau</a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';

const toast = useToast();
const authStore = useAuthStore();
const lichSuVeXes = ref([]);
const loading = ref(false);
const pagination = ref({ total: 0, page: 1, limit: 10 });

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.limit));
const pageRange = computed(() => {
  const range = [];
  const start = Math.max(1, pagination.value.page - 2);
  const end = Math.min(totalPages.value, pagination.value.page + 2);
  for (let i = start; i <= end; i++) range.push(i);
  return range;
});

const getStatusClass = (status) => {
  const classes = {
    Booked: 'badge bg-primary',
    Paid: 'badge bg-success',
    Cancelled: 'badge bg-danger',
    Refunded: 'badge bg-warning',
  };
  return classes[status] || 'badge bg-secondary';
};

const fetchLichSuVeXe = async (page = 1) => {
  if (!authStore.user?.khachHangId) {
    toast.error('Tài khoản chưa được liên kết với thông tin khách hàng.');
    return;
  }
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lichsuve`, {
      params: { page, limit: pagination.value.limit },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    lichSuVeXes.value = response.data.data;
    pagination.value = response.data.pagination;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Lỗi khi tải lịch sử vé xe');
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchLichSuVeXe());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.cusdash-header-section {
  display: flex;
  justify-content: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.07);
}
.cusdash-header-main-row {
  width: 100%;
  max-width: 1100px;
}
.cusdash-header-top {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.cusdash-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.cusdash-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
}
.cusdash-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.cusdash-empty {
  border-radius: 0.7rem;
  background: #232946;
  color: #a5b4fc;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 2rem;
  text-align: center;
}
.table {
  background: #232946;
  color: #dde6ed;
  border-radius: 0.7rem;
}
.table th,
.table td {
  vertical-align: middle;
  padding: 1rem;
}
.table thead th {
  background: #1A202C;
  color: #a5b4fc;
}
.table tbody tr:hover {
  background: #2a3142;
}
.badge {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}
.pagination .page-link {
  background: #232946;
  color: #dde6ed;
  border: none;
  margin: 0 0.2rem;
  border-radius: 0.5rem;
}
.pagination .page-item.active .page-link {
  background: #6366f1;
  color: #fff;
}
.pagination .page-item.disabled .page-link {
  background: #2a3142;
  color: #9a9ea5;
}
.loading-spinner {
  width: 3rem;
  height: 3rem;
}
@media (max-width: 768px) {
  .cusdash-header-section {
    padding: 1.2rem 0.5rem;
  }
  .cusdash-title {
    font-size: 1.3rem;
  }
  .table th,
  .table td {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
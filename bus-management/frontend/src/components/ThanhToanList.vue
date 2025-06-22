<template>
  <div class="thanhtoan-list-card animate-slide-up p-0">
    <div class="card-header d-flex justify-content-between align-items-center px-4 pt-4 pb-2">
      <h3 class="list-title m-0">Danh sách thanh toán</h3>
      <button class="reload-btn" @click="reloadList" v-tooltip="'Tải lại danh sách'">Tải lại danh sách</button>
    </div>
    <div class="search-bar-wrapper px-4 pb-3">
      <input
        v-model="searchTerm"
        type="text"
        class="search-input"
        placeholder="Tìm kiếm thanh toán... (mã vé, khách hàng, trạng thái, phương thức)"
      />
    </div>
    <div v-if="store.loading" class="text-center py-5">
      <div class="loading-spinner spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="table-responsive">
      <table class="table thanhtoan-table mb-0">
        <thead>
          <tr>
            <th class="highlight-text">Vé xe</th>
            <th class="highlight-text">Phương thức</th>
            <th class="highlight-text">Số tiền</th>
            <th class="highlight-text">Ngày thanh toán</th>
            <th class="highlight-text">Trạng thái</th>
            <th class="text-center highlight-text">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="thanhToan in filteredThanhToans" :key="thanhToan._id" class="table-row-hover">
            <td>{{ thanhToan.veXeId?.maSoGhe || 'N/A' }}</td>
            <td>{{ thanhToan.phuongThucThanhToan }}</td>
            <td class="price-cell">{{ thanhToan.soTien.toLocaleString('vi-VN') }} VNĐ</td>
            <td>
              <i class="bi bi-calendar-check me-2 text-warning"></i>
              {{ new Date(thanhToan.ngayThanhToan).toLocaleString('vi-VN') }}
            </td>
            <td>
              <span :class="['status-badge', getStatusClass(thanhToan.trangThai)]">{{ thanhToan.trangThai }}</span>
            </td>
            <td class="action-buttons text-center">
              <button class="action-btn text-edit-btn me-2" @click="$emit('edit', thanhToan)" v-tooltip="'Sửa thanh toán'">Sửa</button>
              <button class="action-btn text-delete-btn" @click="store.deleteThanhToan(thanhToan._id)" v-tooltip="'Xóa thanh toán'">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="mt-4">
        <ul class="pagination justify-content-center thanhtoan-pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchThanhToans(store.pagination.page - 1)"><i class="bi bi-chevron-left"></i> Trước</a>
          </li>
          <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
            <a class="page-link" @click="store.fetchThanhToans(n)">{{ n }}</a>
          </li>
          <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
            <a class="page-link" @click="store.fetchThanhToans(store.pagination.page + 1)">Sau <i class="bi bi-chevron-right"></i></a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useThanhToanStore } from '../stores/thanhToan';
import { ref, computed, onMounted } from 'vue';
const store = useThanhToanStore();
const searchTerm = ref('');
onMounted(() => {
  store.fetchThanhToans();
});
const reloadList = () => {
  store.fetchThanhToans();
};
const filteredThanhToans = computed(() => {
  if (!searchTerm.value.trim()) return store.thanhToans;
  const keyword = searchTerm.value.trim().toLowerCase();
  return store.thanhToans.filter(tt => {
    return (
      (tt.veXeId?.maSoGhe || '').toLowerCase().includes(keyword) ||
      (tt.veXeId?.khachHangId?.hoVaTen || '').toLowerCase().includes(keyword) ||
      (tt.trangThai || '').toLowerCase().includes(keyword) ||
      (tt.phuongThucThanhToan || '').toLowerCase().includes(keyword)
    );
  });
});
function getStatusClass(status) {
  switch (status) {
    case 'Success': return 'status-success';
    case 'Pending': return 'status-pending';
    case 'Failed': return 'status-failed';
    default: return 'status-unknown';
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.thanhtoan-list-card {
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1.5px solid #363b53;
  background: #1A202C;
  font-family: 'Inter', 'Roboto', sans-serif;
  padding-bottom: 1.5rem;
  color: #ffffff;
  overflow: hidden;
}
.card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1rem !important;
  margin-bottom: 1.5rem;
}
.list-title {
  font-size: 2rem;
  font-weight: 700;
  color: #dde6ed;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(99,102,241,0.10), 0 1px 2px rgba(0,0,0,0.12);
  padding-bottom: 0.7rem;
  margin-bottom: 0;
  border-bottom: none;
  background: none;
}
.thanhtoan-table {
  border-radius: 1.2rem;
  overflow: hidden;
  background: transparent;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.05);
}
.thanhtoan-table thead tr {
  background: linear-gradient(90deg, #5a5fcc 0%, #5190e0 100%);
}
.thanhtoan-table th {
  color: #000000;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  padding: 1.1rem 1rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  vertical-align: middle;
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.3);
}
.thanhtoan-table td {
  vertical-align: middle;
  font-size: 0.98rem;
  border-color: #2D3748;
  padding: 1rem 1rem;
  background: transparent;
  color: #ffffff;
}
.price-cell {
  font-weight: 600;
  color: #6EE7B7;
  font-size: 1.02rem;
}
.table-row-hover:hover {
  background: #232936 !important;
  transition: background 0.2s ease-in-out;
}
.status-badge {
  font-size: 0.9rem;
  padding: 0.5em 1.2em;
  border-radius: 1.5rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.08);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.status-success {
  background: #1e3a24;
  color: #6EE7B7;
  border-color: #2e5a34;
}
.status-pending {
  background: #2a2a1e;
  color: #FFD700;
  border-color: #4a4a2e;
}
.status-failed {
  background: #3a1e1e;
  color: #EF4444;
  border-color: #5a2e2e;
}
.status-unknown {
  background: #2a2a3a;
  color: #A78BFA;
  border-color: #4a4a5a;
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
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.text-edit-btn {
  background: #232946;
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
.thanhtoan-pagination .page-item .page-link {
  border-radius: 0.75rem !important;
  margin: 0 0.25em;
  color: #6366f1;
  font-weight: 600;
  background: #232946;
  border: 1.5px solid #363b53;
  transition: all 0.2s ease;
  padding: 0.6em 1em;
  min-width: 2.5em;
  text-align: center;
}
.thanhtoan-pagination .page-item.active .page-link,
.thanhtoan-pagination .page-item .page-link:hover {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
}
.thanhtoan-pagination .page-item.disabled .page-link {
  background: #1A202C;
  color: #6b7280;
  border-color: #2D3748;
  cursor: not-allowed;
  opacity: 0.6;
}
.loading-spinner {
  width: 3rem;
  height: 3rem;
  color: #6366F1;
}
@media (max-width: 992px) {
  .thanhtoan-table th, .thanhtoan-table td {
    padding: 0.8rem 0.6rem;
    font-size: 0.95rem;
  }
  .status-badge {
    padding: 0.4em 0.9em;
    font-size: 0.85rem;
  }
  .action-btn {
    padding: 0.5em 1em;
    font-size: 0.9rem;
  }
  .list-title {
    font-size: 1.6rem;
  }
}
@media (max-width: 768px) {
  .thanhtoan-list-card {
    padding: 0.5rem;
    border-radius: 1rem;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  .list-title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem !important;
  }
  .thanhtoan-table {
    border-radius: 0.8rem;
  }
  .thanhtoan-table th, .thanhtoan-table td {
    font-size: 0.88rem;
    padding: 0.7rem 0.5rem;
  }
  .status-badge {
    font-size: 0.8rem;
    padding: 0.35em 0.8em;
  }
  .action-btn {
    padding: 0.4em 0.8em;
    font-size: 0.85rem;
  }
}
@media (max-width: 480px) {
  .thanhtoan-list-card {
    border-radius: 0.7rem;
    padding: 0.3rem;
  }
  .list-title {
    font-size: 1.3rem;
  }
  .thanhtoan-table th, .thanhtoan-table td {
    font-size: 0.8rem;
    padding: 0.6rem 0.4rem;
  }
  .status-badge {
    font-size: 0.75rem;
    padding: 0.3em 0.6em;
  }
  .action-btn {
    padding: 0.3em 0.6em;
    font-size: 0.75rem;
  }
}
.search-bar-wrapper {
  margin-bottom: 0.5rem;
}
.search-input {
  width: 100%;
  padding: 0.7rem 1.1rem;
  border-radius: 0.7rem;
  border: 1.5px solid #ffffff;
  background: #1A202C;
  color: #fff;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(248, 247, 247, 0.07);
}
.search-input:focus {
  background: #0000004f;
  border-color: #6b6b6b;
}
.reload-btn {
  background: #1A202C;
  color: #fff;
  border: 1.5px solid #ffffff;
  border-radius: 0.7rem;
  padding: 0.55rem 1.1rem;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(99,102,241,0.10);
  cursor: pointer;
}
.reload-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
</style> 
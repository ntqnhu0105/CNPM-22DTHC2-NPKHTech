<template>
  <div class="chuyenxe-list-card animate-slide-up p-0">
    <div class="card-header d-flex justify-content-between align-items-center px-4 pt-4 pb-2">
      <h3 class="list-title m-0">Danh sách chuyến xe</h3>
      <button class="reload-btn" @click="reloadList" v-tooltip="'Tải lại danh sách'">Tải lại danh sách</button>
    </div>
    <div class="search-bar-wrapper px-4 pb-3">
      <input
        v-model="searchTerm"
        type="text"
        class="search-input"
        placeholder="Tìm kiếm chuyến xe... (điểm đi, điểm đến, biển số, tài xế)"
      />
    </div>
    <div v-if="store.loading" class="text-center py-5">
      <div class="loading-spinner spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="table-responsive">
      <table class="table chuyenxe-table mb-0">
        <thead>
          <tr>
            <th class="highlight-text">Tuyến xe</th>
            <th class="highlight-text">Xe</th>
            <th class="highlight-text">Tài xế</th>
            <th class="highlight-text">Giá</th>
            <th class="highlight-text">Thời gian khởi hành</th>
            <th class="highlight-text">Trạng thái</th>
            <th class="text-center highlight-text">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chuyenXe in filteredChuyenXes" :key="chuyenXe._id" class="table-row-hover">
            <td>
              <div class="route-info">
                <i class="bi bi-geo-alt-fill me-1 text-primary"></i>
                <span>{{ chuyenXe.tuyenXeId.diemDi }}</span>
                <i class="bi bi-arrow-right mx-2"></i>
                <span>{{ chuyenXe.tuyenXeId.diemDen }}</span>
              </div>
            </td>
            <td><i class="bi bi-truck me-2 text-info"></i>{{ chuyenXe.xeId.bienSoXe }}</td>
            <td><i class="bi bi-person-circle me-2 text-success"></i>{{ chuyenXe.taiXeId.hoVaTen }}</td>
            <td class="price-cell">{{ chuyenXe.gia.toLocaleString('vi-VN') }} VNĐ</td>
            <td>
              <i class="bi bi-calendar-check me-2 text-warning"></i>
              {{ new Date(chuyenXe.thoiGianKhoiHanh).toLocaleString('vi-VN') }}
            </td>
            <td>
              <span :class="['status-badge', statusClass(chuyenXe.trangThaiChuyen)]" v-tooltip="trangThaiTooltip(chuyenXe.trangThaiChuyen)">
                <i :class="statusIcon(chuyenXe.trangThaiChuyen)" class="me-1"></i>
                {{ chuyenXe.trangThaiChuyen }}
              </span>
            </td>
            <td class="action-buttons text-center">
              <button class="action-btn text-edit-btn me-2" @click="$emit('edit', chuyenXe)" v-tooltip="'Sửa chuyến xe'">
                Sửa
              </button>
              <button class="action-btn text-delete-btn" @click="store.deleteChuyenXe(chuyenXe._id)" v-tooltip="'Xóa chuyến xe'">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="mt-4">
        <ul class="pagination justify-content-center chuyenxe-pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchChuyenXes(store.pagination.page - 1)">
              <i class="bi bi-chevron-left"></i> Trước
            </a>
          </li>
          <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
            <a class="page-link" @click="store.fetchChuyenXes(n)">{{ n }}</a>
          </li>
          <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
            <a class="page-link" @click="store.fetchChuyenXes(store.pagination.page + 1)">
              Sau <i class="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useChuyenXeStore } from '../stores/chuyenXe';
import { ref, computed, onMounted } from 'vue';
const store = useChuyenXeStore();
const searchTerm = ref('');
onMounted(() => {
  store.fetchChuyenXes();
});
const reloadList = () => {
  store.fetchChuyenXes();
};

const filteredChuyenXes = computed(() => {
  if (!searchTerm.value.trim()) return store.chuyenXes;
  const keyword = searchTerm.value.trim().toLowerCase();
  return store.chuyenXes.filter(cx => {
    return (
      cx.tuyenXeId.diemDi.toLowerCase().includes(keyword) ||
      cx.tuyenXeId.diemDen.toLowerCase().includes(keyword) ||
      cx.xeId.bienSoXe.toLowerCase().includes(keyword) ||
      cx.taiXeId.hoVaTen.toLowerCase().includes(keyword)
    );
  });
});

function statusClass(status) {
  switch (status) {
    case 'Pending': return 'status-pending';
    case 'Running': return 'status-running';
    case 'Completed': return 'status-completed';
    case 'Cancelled': return 'status-cancelled';
    default: return 'status-unknown';
  }
}
function statusIcon(status) {
  switch (status) {
    case 'Pending': return 'bi bi-hourglass-split';
    case 'Running': return 'bi bi-truck';
    case 'Completed': return 'bi bi-check-circle';
    case 'Cancelled': return 'bi bi-x-circle';
    default: return 'bi bi-question-circle';
  }
}
function trangThaiTooltip(status) {
  switch (status) {
    case 'Pending': return 'Chuyến xe đang chờ khởi hành';
    case 'Running': return 'Chuyến xe đang chạy';
    case 'Completed': return 'Chuyến xe đã hoàn thành';
    case 'Cancelled': return 'Chuyến xe đã hủy';
    default: return 'Trạng thái không xác định';
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');

/* Base Card Styling */
.chuyenxe-list-card {
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1.5px solid #363b53; /* Slightly lighter border for contrast */
  background: #1A202C; /* Retained dark background */
  font-family: 'Inter', 'Roboto', sans-serif;
  padding-bottom: 1.5rem;
  color: #ffffff; /* Light text for dark background */
  overflow: hidden; /* Ensures rounded corners are respected */
}

/* Header Styling */
.card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); /* Subtle separator */
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

/* Table Styling */
.chuyenxe-table {
  border-radius: 1.2rem;
  overflow: hidden; /* Ensures consistent border-radius for table */
  background: transparent; /* Đảm bảo nền bảng trong suốt */
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.05); /* Subtle inner shadow */
}

.chuyenxe-table thead tr {
  background: linear-gradient(90deg, #5a5fcc 0%, #5190e0 100%); /* Slightly adjusted gradient */
}

.chuyenxe-table th {
  color: #1A202C; /* Default color, will be overridden by highlight-text */
  font-weight: 700;
  font-size: 1.05rem; /* Slightly smaller for better fit */
  border: none;
  padding: 1.1rem 1rem; /* More padding for spacious feel */
  letter-spacing: 0.02em;
  text-transform: uppercase; /* Professional look */
  vertical-align: middle;
}

/* Highlighted header text */
.highlight-text {
  color: #DDE6ED; /* Màu trắng sáng hơn để nổi bật */
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.3); /* Hiệu ứng phát sáng nhẹ */
}


.chuyenxe-table td {
  vertical-align: middle;
  font-size: 0.98rem; /* Consistent font size */
  border-color: #2D3748; /* Slightly lighter border for subtle separation */
  padding: 1rem 1rem; /* More padding */
  background: transparent; /* Đảm bảo nền ô trong suốt */
  color: #ffffff; /* Slightly desaturated text color */
}

.table-row-hover:hover {
  background: #232936 !important; /* Slightly darker on hover */
  transition: background 0.2s ease-in-out;
}

/* Specific Cell Styling */
.route-info {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #ffffff;
}

.route-info i {
  font-size: 1.1em;
}

.price-cell {
  font-weight: 600;
  color: #6EE7B7; /* Highlight price with a vibrant color */
  font-size: 1.02rem;
}

/* Status Badges */
.status-badge {
  font-size: 0.9rem; /* Slightly smaller for a cleaner look */
  padding: 0.5em 1.2em; /* More balanced padding */
  border-radius: 1.5rem; /* More rounded */
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.08);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border for definition */
}

.status-badge i {
  font-size: 1em;
}

.status-pending {
  background: #2a2a1e; /* Darker, desaturated background */
  color: #FFD700; /* Gold color for pending */
  border-color: #4a4a2e;
}
.status-running {
  background: #1e2a3a;
  color: #60A5FA; /* Blue for running */
  border-color: #2e4a6a;
}
.status-completed {
  background: #1e3a24;
  color: #6EE7B7; /* Green for completed */
  border-color: #2e5a34;
}
.status-cancelled {
  background: #3a1e1e;
  color: #EF4444; /* Red for cancelled */
  border-color: #5a2e2e;
}
.status-unknown {
  background: #2a2a3a;
  color: #A78BFA; /* Purple for unknown */
  border-color: #4a4a5a;
}

/* Action Buttons */
.action-buttons {
  white-space: nowrap; /* Ensures buttons stay on one line */
}

.action-btn {
  border-radius: 0.5rem; /* Slightly rounded rectangular shape for text buttons */
  padding: 0.6em 1.2em; /* Adjusted padding for text */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* More dynamic transition */
  font-size: 0.95rem; /* Font size for text buttons */
  font-weight: 600; /* Bold text */
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  transform: translateY(-2px); /* Lift effect on hover */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.text-edit-btn {
  background: #232946; /* Dark background */
  color: #60A5FA; /* Blue text */
  border: 1px solid #363b53; /* Subtle border */
}
.text-edit-btn:hover {
  background: #2d3650; /* Darker on hover */
  color: #a5b4fc; /* Lighter blue on hover */
}

.text-delete-btn {
  background: #3b1d1d; /* Dark red background */
  color: #EF4444; /* Red text */
  border: 1px solid #5a2e2e; /* Subtle red border */
}
.text-delete-btn:hover {
  background: #7f1d1d; /* Darker red on hover */
  color: #fee2e2; /* Lighter red on hover */
}


/* Pagination */
.chuyenxe-pagination .page-item .page-link {
  border-radius: 0.75rem !important; /* Modern rounded corners */
  margin: 0 0.25em;
  color: #6366f1;
  font-weight: 600;
  background: #232946; /* Matches card background */
  border: 1.5px solid #363b53; /* Matches card border */
  transition: all 0.2s ease;
  padding: 0.6em 1em; /* More balanced padding */
  min-width: 2.5em; /* Ensures consistent button size */
  text-align: center;
}

.chuyenxe-pagination .page-item.active .page-link,
.chuyenxe-pagination .page-item .page-link:hover {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border-color: transparent; /* No border when active/hover */
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4); /* Glow effect */
}

.chuyenxe-pagination .page-item.disabled .page-link {
  background: #1A202C;
  color: #6b7280;
  border-color: #2D3748;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Loading Spinner */
.loading-spinner {
  width: 3rem;
  height: 3rem;
  color: #6366F1;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .chuyenxe-table th, .chuyenxe-table td {
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
  .chuyenxe-list-card {
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
  .chuyenxe-table {
    border-radius: 0.8rem;
  }
  .chuyenxe-table th, .chuyenxe-table td {
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
  .route-info span {
    display: block; /* Stack departure/destination on small screens */
  }
  .route-info .bi-arrow-right {
    display: none; /* Hide arrow if stacked */
  }
}

@media (max-width: 480px) {
  .chuyenxe-list-card {
    border-radius: 0.7rem;
    padding: 0.3rem;
  }
  .list-title {
    font-size: 1.3rem;
  }
  .chuyenxe-table th, .chuyenxe-table td {
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
  Background: #0000004f;
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
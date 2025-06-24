<template>
  <DefaultLayout>
    <section class="cusdash-2col-section">
      <div class="cusdash-2col-layout">
        <!-- Cột 1: Tiêu đề + Form -->
        <div class="cusdash-col cusdash-col-left">
          <div class="cusdash-header-info">
            <h1 class="cusdash-title">
              <i class="bi bi-search me-2 text-primary"></i>Tra cứu chuyến xe
            </h1>
            <p class="cusdash-desc">Tìm kiếm chuyến xe phù hợp và đặt vé nhanh chóng, dễ dàng.</p>
            <router-link
              to="/customer/ticket-history"
              class="btn mt-3 fw-bold w-100"
              style="font-size:1.08rem; letter-spacing:0.5px; border-radius:0.7em; box-shadow:0 2px 8px rgba(34,197,94,0.15); background: #22c55e; color: #fff; border: 1.5px solid #22c55e; transition: all 0.2s;"
            >
              <i class="bi bi-ticket-perforated me-2"></i>Lịch sử vé của tôi
            </router-link>
          </div>
          <div class="cusdash-search-card">
            <form class="cusdash-search-form">
              <div class="cusdash-search-fields">
                <div class="cusdash-search-field">
                  <label class="cusdash-search-label">Điểm đi</label>
                  <div class="input-icon">
                    <i class="bi bi-geo-alt"></i>
                    <select v-model="searchForm.diemDi" required class="cusdash-search-input">
                      <option value="" disabled>Chọn điểm đi</option>
                      <option v-for="tuyenXe in tuyenXes" :key="tuyenXe._id" :value="tuyenXe.diemDi">{{ tuyenXe.diemDi }}</option>
                    </select>
                  </div>
                </div>
                <div class="cusdash-search-field">
                  <label class="cusdash-search-label">Điểm đến</label>
                  <div class="input-icon">
                    <i class="bi bi-geo"></i>
                    <select v-model="searchForm.diemDen" required class="cusdash-search-input">
                      <option value="" disabled>Chọn điểm đến</option>
                      <option v-for="tuyenXe in tuyenXes" :key="tuyenXe._id" :value="tuyenXe.diemDen">{{ tuyenXe.diemDen }}</option>
                    </select>
                  </div>
                </div>
                <div class="cusdash-search-field">
                  <label class="cusdash-search-label">Ngày khởi hành</label>
                  <div class="input-icon">
                    <i class="bi bi-calendar-event"></i>
                    <input v-model="searchForm.ngayKhoiHanh" type="date" required class="cusdash-search-input" />
                  </div>
                </div>
              </div>
              <div class="cusdash-search-actions">
                <button type="button" class="cusdash-reload-btn" @click="reloadSearch">
                  <i class="bi bi-arrow-clockwise"></i> Làm mới
                </button>
                <div v-if="!store.loading && store.chuyenXes.length > 0" class="cusdash-found-count mb-2">
                  Đã tìm thấy {{ store.chuyenXes.length }} chuyến xe
                </div>
                <div v-if="!store.loading && store.chuyenXes.length === 0" class="cusdash-found-count cusdash-notfound-count mb-2">Không tìm thấy chuyến xe nào</div>
              </div>
            </form>
          </div>
        </div>
        <!-- Cột 2: Danh sách trip -->
        <div class="cusdash-col cusdash-col-right">
          <div class="cusdash-results-list">
            <div v-if="store.loading" class="text-center py-5">
              <div class="loading-spinner spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="store.chuyenXes.length > 0" class="cusdash-trip-list cusdash-trip-list-grid">
              <div v-for="chuyenXe in store.chuyenXes" :key="chuyenXe._id" class="cusdash-trip-card">
                <div class="trip-card-flex">
                  <!-- Hàng 1: Điểm đi → Điểm đến (màu hồng phấn) | Thời gian -->
                  <div class="trip-card-row trip-card-row1">
                    <span class="trip-card-route">
                      <i class="bi bi-geo-alt-fill trip-card-route-icon"></i>
                      <span class="trip-card-diemdi">{{ chuyenXe.tuyenXeId.diemDi }}</span>
                      <i class="bi bi-chevron-right mx-1 text-secondary"></i>
                      <span class="trip-card-diemden">{{ chuyenXe.tuyenXeId.diemDen }}</span>
                    </span>
                    <span class="trip-card-time">
                      <i class="bi bi-calendar-check me-1 text-warning small"></i>
                      {{ new Date(chuyenXe.thoiGianKhoiHanh).toLocaleString('vi-VN') }}
                    </span>
                  </div>
                  <!-- Hàng 2: Xe | Giá -->
                  <div class="trip-card-row trip-card-row2">
                    <span class="trip-card-xe">
                      <i class="bi bi-truck me-1 text-info small"></i>
                      {{ chuyenXe.xeId.bienSoXe }}
                    </span>
                    <span class="trip-card-price">{{ chuyenXe.gia.toLocaleString('vi-VN') }} VNĐ</span>
                  </div>
                  <!-- Hàng 3: Tài xế | Nút đặt vé + badge huỷ -->
                  <div class="trip-card-row trip-card-row3">
                    <span class="trip-card-taixe">
                      <i class="bi bi-person-circle me-1 text-secondary small"></i>
                      {{ chuyenXe.taiXeId.hoVaTen }}
                    </span>
                    <span class="trip-card-actions">
                      <button
                        class="btn btn-success trip-card-book-btn fw-bold"
                        @click="openSeatSelection(chuyenXe)"
                        :disabled="chuyenXe.trangThaiChuyen === 'Cancelled' || chuyenXe.trangThaiChuyen === 'Completed'"
                        :class="{ 'cusdash-btn-disabled': chuyenXe.trangThaiChuyen === 'Cancelled' || chuyenXe.trangThaiChuyen === 'Completed' }"
                      >
                        <i class="bi bi-ticket-detailed me-2"></i>Đặt vé
                      </button>
                      <span v-if="chuyenXe.trangThaiChuyen === 'Cancelled'" class="badge bg-danger ms-2">Đã huỷ</span>
                      <span v-if="chuyenXe.trangThaiChuyen === 'Completed'" class="badge bg-success ms-2">Đã hoàn thành</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Seat Selection Modal -->
    <div class="modal fade" id="seatModal" tabindex="-1" aria-labelledby="seatModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="seatModalLabel">Chọn ghế</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="loadingSeats" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
            </div>
            <div v-else-if="availableSeats.length === 0" class="alert alert-warning">
              Không còn ghế trống.
            </div>
            <div v-else class="seat-grid">
              <button
                v-for="seat in availableSeats"
                :key="seat.maSoGhe"
                class="btn btn-outline-primary m-1"
                :class="{ 'btn-primary': selectedSeat === seat.maSoGhe }"
                @click="selectSeat(seat.maSoGhe)"
              >
                {{ seat.maSoGhe }}
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button
              type="button"
              class="btn btn-success"
              :disabled="!selectedSeat"
              @click="confirmBooking"
            >
              Xác nhận đặt vé
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useChuyenXeStore } from '../stores/chuyenXe';
import { useTuyenXeStore } from '../stores/tuyenXe';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { useRouter } from 'vue-router';
import * as bootstrap from 'bootstrap';

const store = useChuyenXeStore();
const tuyenXeStore = useTuyenXeStore();
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const searchForm = ref({ diemDi: '', diemDen: '', ngayKhoiHanh: '' });
const tuyenXes = ref([]);
const availableSeats = ref([]);
const selectedSeat = ref(null);
const selectedTrip = ref(null);
const loadingSeats = ref(false);

tuyenXeStore.fetchTuyenXes().then(() => {
    tuyenXes.value = tuyenXeStore.tuyenXes;
});

const searchTrips = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chuyenxe`, {
            params: {
                diemDi: searchForm.value.diemDi,
                diemDen: searchForm.value.diemDen,
                ngayKhoiHanh: searchForm.value.ngayKhoiHanh,
                page: 1,
                limit: 10,
            },
            headers: {
                Authorization: `Bearer ${authStore.token}`, // Add if authentication is required
            },
        });
        store.chuyenXes = response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi tìm kiếm chuyến xe');
    }
};

const openSeatSelection = async (chuyenXe) => {
    selectedTrip.value = chuyenXe;
    loadingSeats.value = true;
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vexe/${chuyenXe._id}/seats`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`, // Add if authentication is required
            },
        });
        availableSeats.value = response.data.availableSeats;
        loadingSeats.value = false;
        selectedSeat.value = null;
        const modal = new bootstrap.Modal(document.getElementById('seatModal'));
        modal.show();
    } catch (error) {
        loadingSeats.value = false;
        toast.error(error.response?.data?.error || 'Lỗi khi tải danh sách ghế');
    }
};

const selectSeat = (seat) => {
    selectedSeat.value = seat;
};

const confirmBooking = async () => {
    if (!authStore.user?.khachHangId) {
        toast.error('Tài khoản của bạn chưa được liên kết với thông tin khách hàng. Vui lòng liên hệ hỗ trợ.');
        return;
    }
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/vexe/book`,
            {
                chuyenXeId: selectedTrip.value._id,
                maSoGhe: selectedSeat.value,
                khachHangId: authStore.user.khachHangId,
            },
            {
                headers: {
                    Authorization: `Bearer ${authStore.token}`, // Add if authentication is required
                },
            }
        );
        toast.success('Đặt vé thành công!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('seatModal'));
        modal.hide();
        router.push('/customer/ticket-history');
    } catch (error) {
        console.error('Booking error:', error.response?.data);
        toast.error(error.response?.data?.error || 'Lỗi khi đặt vé');
    }
};

const reloadSearch = () => {
  searchForm.value = { diemDi: '', diemDen: '', ngayKhoiHanh: '' };
  searchTrips();
};

// Tự động tìm kiếm khi bất kỳ trường nào thay đổi (chỉ cần 1 trường có giá trị)
watch(
  () => ({ ...searchForm.value }),
  (newVal) => {
    if (newVal.diemDi || newVal.diemDen || newVal.ngayKhoiHanh) {
      searchTrips();
    }
  },
  { deep: true }
);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.cusdash-2col-section {
  width: 100%;
  min-height: 80vh;
  background: #1A202C;
  border-radius: 1.2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}
.cusdash-2col-layout {
  display: flex;
  width: 100%;
  max-width: 1300px;
  gap: 2.5rem;
}
.cusdash-col {
  display: flex;
  flex-direction: column;
}
.cusdash-col-left {
  flex: 1;
  min-width: 320px;
  max-width: 400px;
  justify-content: flex-start;
  gap: 2rem;
}
.cusdash-col-right {
  flex: 2;
  min-width: 0;
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #363b53 #232946;
}
.cusdash-col-right::-webkit-scrollbar {
  width: 0.5em;
  background: transparent;
}
.cusdash-col-right::-webkit-scrollbar-thumb {
  background: #363b53;
  border-radius: 8px;
  opacity: 0;
}
.cusdash-col-right:hover::-webkit-scrollbar-thumb {
  opacity: 1;
}
.cusdash-col-right::-webkit-scrollbar {
  display: none;
}
.cusdash-results-list {
  width: 100%;
  height: 100%;
}
.cusdash-trip-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.cusdash-trip-list-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}
.cusdash-trip-card {
  background: #232946;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(99,102,241,0.10);
  padding: 1rem 1rem 0.8rem 1rem;
  color: #dde6ed;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
  min-width: 0;
}
.cusdash-trip-card:hover {
  box-shadow: 0 8px 24px rgba(99,102,241,0.16);
  transform: translateY(-2px) scale(1.01);
}
.cusdash-trip-header {
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.cusdash-trip-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #a5b4fc;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.cusdash-trip-info {
  margin-bottom: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.cusdash-trip-row {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.98rem;
  margin-bottom: 0.1rem;
}
.cusdash-trip-label {
  color: #bfc9e0;
  font-weight: 500;
  margin-right: 0.2rem;
}
.cusdash-trip-value {
  color: #dde6ed;
  font-weight: 400;
}
.cusdash-price {
  color: #6EE7B7;
  font-weight: 700;
  font-size: 1.05rem;
}
.loading-spinner {
  width: 3rem;
  height: 3rem;
  color: #6366F1;
}
.cusdash-search-card {
  background: #1A202C;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.10);
  padding: 2rem 1.5rem 1.2rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.cusdash-search-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.cusdash-search-fields {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.cusdash-search-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.cusdash-search-label {
  font-size: 0.98rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.1rem;
}
.cusdash-search-input {
  border-radius: 0.8rem;
  border: 1.5px solid #e0e7ef;
  padding: 0.55em 2.2em 0.55em 2.2em;
  font-size: 1.05rem;
  background: #fff;
  color: #232946;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.cusdash-search-input:focus {
  border-color: #6EE7B7;
  box-shadow: 0 0 0 2px #6EE7B733;
  outline: none;
}
.input-icon {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon i {
  position: absolute;
  left: 0.9em;
  color: #a5b4fc;
  font-size: 1.1em;
  z-index: 2;
}
.cusdash-search-input, .cusdash-search-field select, .cusdash-search-field input[type="date"] {
  padding-left: 2.2em !important;
}
.cusdash-reload-btn {
  border-radius: 2em;
  padding: 0.45em 1.3em;
  font-size: 1.02rem;
  font-weight: 600;
  background: #fff;
  color: #232946;
  border: 1.5px solid #22c55e;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(99,102,241,0.07);
}
.cusdash-reload-btn:hover {
  background: #22c55e;
  color: #fff;
  border-color: #22c55e;
}
.cusdash-search-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 0.5rem;
}
.cusdash-found-count {
  font-size: 1.05rem;
  font-weight: 500;
  color: #6EE7B7;
}
.cusdash-trip-card .badge.bg-danger {
  font-size: 0.95rem;
  font-weight: 600;
  background: #ef4444;
  color: #fff;
  margin-left: 0.5rem;
  padding: 0.3em 0.7em;
  border-radius: 0.5em;
}
.cusdash-trip-card .badge.bg-success {
  font-size: 0.95rem;
  font-weight: 600;
  background: #22c55e;
  color: #fff;
  margin-left: 0.5rem;
  padding: 0.3em 0.7em;
  border-radius: 0.5em;
}
.cusdash-notfound-count {
  color: #f59e42;
}
.cusdash-btn-disabled,
.cusdash-btn-disabled:disabled {
  opacity: 0.5;
  pointer-events: none;
  background: #6c757d !important;
  color: #fff !important;
  border-color: #6c757d !important;
  cursor: not-allowed;
}
.trip-card-flex {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
}
.trip-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.trip-card-row1 {
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 0.1rem;
}
.trip-card-route {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.trip-card-route-icon {
  color: #f472b6;
}
.trip-card-diemdi, .trip-card-diemden {
  color: #f472b6;
  font-weight: 700;
}
.trip-card-time {
  font-size: 0.98rem;
  color: #bfc9e0;
  font-weight: 400;
  display: flex;
  align-items: center;
}
.trip-card-row2 {
  font-size: 1rem;
  margin-bottom: 0.1rem;
}
.trip-card-xe {
  color: #dde6ed;
  font-weight: 400;
  display: flex;
  align-items: center;
}
.trip-card-price {
  color: #6EE7B7;
  font-weight: 700;
  font-size: 1.05rem;
}
.trip-card-row3 {
  font-size: 0.98rem;
}
.trip-card-taixe {
  color: #dde6ed;
  font-weight: 400;
  display: flex;
  align-items: center;
}
.trip-card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.trip-card-book-btn {
  padding: 0.3em 1.1em;
  font-size: 0.98rem;
  margin: 0;
  min-width: 90px;
}
@media (max-width: 900px) {
  .cusdash-trip-list-grid {
    grid-template-columns: 1fr;
  }
}
</style>
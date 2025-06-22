<template>
  <DefaultLayout>
    <section class="cusdash-header-section">
      <div class="cusdash-header-main-row">
        <div class="cusdash-header-top">
          <i class="bi bi-search cusdash-header-icon"></i>
          <div>
            <h1 class="cusdash-title">Tra cứu chuyến xe</h1>
            <p class="cusdash-desc">Tìm kiếm chuyến xe phù hợp và đặt vé nhanh chóng, dễ dàng.</p>
          </div>
        </div>
        <form @submit.prevent="searchTrips" class="cusdash-search-form">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Điểm đi</label>
              <select v-model="searchForm.diemDi" class="form-input" required>
                <option value="" disabled>Chọn điểm đi</option>
                <option v-for="tuyenXe in tuyenXes" :key="tuyenXe._id" :value="tuyenXe.diemDi">{{ tuyenXe.diemDi }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Điểm đến</label>
              <select v-model="searchForm.diemDen" class="form-input" required>
                <option value="" disabled>Chọn điểm đến</option>
                <option v-for="tuyenXe in tuyenXes" :key="tuyenXe._id" :value="tuyenXe.diemDen">{{ tuyenXe.diemDen }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Ngày khởi hành</label>
              <input v-model="searchForm.ngayKhoiHanh" type="date" class="form-input" required />
            </div>
          </div>
          <button type="submit" class="btn bg-gradient w-100 mt-3 text-light fw-bold cusdash-search-btn">
            <i class="bi bi-search me-2"></i>Tìm kiếm
          </button>
        </form>
      </div>
    </section>
    <section class="cusdash-results">
      <div v-if="store.loading" class="text-center py-5">
        <div class="loading-spinner spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="store.chuyenXes.length === 0" class="alert alert-info cusdash-empty">Không tìm thấy chuyến xe.</div>
      <div v-else class="row g-4">
        <div v-for="chuyenXe in store.chuyenXes" :key="chuyenXe._id" class="col-md-4 col-sm-6">
          <div class="cusdash-trip-card">
            <div class="cusdash-trip-header">
              <span class="cusdash-trip-route">
                <i class="bi bi-geo-alt-fill text-primary"></i>
                {{ chuyenXe.tuyenXeId.diemDi }}
                <i class="bi bi-arrow-right mx-2"></i>
                {{ chuyenXe.tuyenXeId.diemDen }}
              </span>
            </div>
            <div class="cusdash-trip-info">
              <div class="cusdash-trip-row">
                <i class="bi bi-calendar-check me-2 text-warning"></i>
                <span>Thời gian: {{ new Date(chuyenXe.thoiGianKhoiHanh).toLocaleString('vi-VN') }}</span>
              </div>
              <div class="cusdash-trip-row">
                <i class="bi bi-cash-coin me-2 text-success"></i>
                <span>Giá: <span class="cusdash-price">{{ chuyenXe.gia.toLocaleString('vi-VN') }} VNĐ</span></span>
              </div>
              <div class="cusdash-trip-row">
                <i class="bi bi-truck me-2 text-info"></i>
                <span>Xe: {{ chuyenXe.xeId.bienSoXe }}</span>
              </div>
              <div class="cusdash-trip-row">
                <i class="bi bi-person-circle me-2 text-secondary"></i>
                <span>Tài xế: {{ chuyenXe.taiXeId.hoVaTen }}</span>
              </div>
            </div>
            <button class="btn btn-success w-100 mt-3 fw-bold" @click="bookTicket(chuyenXe._id)">
              <i class="bi bi-ticket-detailed me-2"></i>Đặt vé
            </button>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useChuyenXeStore } from '../stores/chuyenXe';
import { useTuyenXeStore } from '../stores/tuyenXe';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { useRouter } from 'vue-router';

const store = useChuyenXeStore();
const tuyenXeStore = useTuyenXeStore();
const toast = useToast();
const router = useRouter();
const searchForm = ref({ diemDi: '', diemDen: '', ngayKhoiHanh: '' });
const tuyenXes = ref([]);

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
      },
    });
    store.chuyenXes = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Lỗi khi tìm kiếm chuyến xe');
  }
};

const bookTicket = async (chuyenXeId) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/vexe`, {
      chuyenXeId,
      khachHangId: authStore.user.khachHangId, // Assumes user has linked khachHangId
      soGhe: 'A1', // Example seat, implement seat selection later
    });
    toast.success('Đặt vé thành công!');
    router.push('/customer/ticket-history');
  } catch (error) {
    toast.error(error.response?.data?.error || 'Lỗi khi đặt vé');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.cusdash-header-section {
  display: flex;
  justify-content: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.cusdash-header-main-row {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: row !important;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}
.cusdash-header-top {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-width: 260px;
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
  letter-spacing: -0.01em;
}
.cusdash-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.cusdash-search-form {
  background: #232946;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  padding: 1.5rem 2rem 1.2rem 2rem;
  min-width: 340px;
  max-width: 480px;
  width: 100%;
  margin: 0;
}
.cusdash-search-form .form-label {
  color: #dde6ed;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 1rem;
}
.form-input, .form-select, select, input[type="date"] {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  border: 1.5px solid #363b53;
  background: #1A202C;
  color: #fff;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  margin-bottom: 1.1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(99,102,241,0.07);
}
.form-input:focus, .form-select:focus, select:focus, input[type="date"]:focus {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99,102,241,0.13);
}
.cusdash-search-btn {
  font-size: 1.1rem;
  padding: 0.9rem 0;
  border-radius: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  border: none;
  transition: background 0.2s, box-shadow 0.2s;
}
.cusdash-search-btn:hover {
  background: #4f46e5;
  color: #fff;
}
.cusdash-results {
  min-height: 300px;
}
.cusdash-empty {
  border-radius: 0.7rem;
  background: #232946;
  color: #a5b4fc;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
}
.cusdash-trip-card {
  background: #232946;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  color: #dde6ed;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: box-shadow 0.2s, transform 0.2s;
}
.cusdash-trip-card:hover {
  box-shadow: 0 12px 36px rgba(99,102,241,0.18);
  transform: translateY(-4px) scale(1.02);
}
.cusdash-trip-header {
  margin-bottom: 1rem;
}
.cusdash-trip-route {
  font-size: 1.15rem;
  font-weight: 700;
  color: #a5b4fc;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cusdash-trip-info {
  margin-bottom: 1rem;
}
.cusdash-trip-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.3rem;
}
.cusdash-price {
  color: #6EE7B7;
  font-weight: 700;
}
.loading-spinner {
  width: 3rem;
  height: 3rem;
  color: #6366F1;
}
@media (max-width: 1200px) {
  .cusdash-header-section {
    padding: 1.2rem 1rem 1rem 1rem;
  }
  .cusdash-search-form {
    max-width: 100%;
    min-width: 0;
    padding: 1.2rem 1rem 1rem 1rem;
  }
}
@media (max-width: 768px) {
  .cusdash-header-section {
    padding: 1.2rem 0.5rem;
  }
  .cusdash-header-top { gap: 0.7rem; }
  .cusdash-title { font-size: 1.3rem; }
  .cusdash-search-form { padding: 1rem 0.5rem; }
  .cusdash-trip-card { padding: 0.7rem 0.5rem 0.7rem 0.5rem; }
}
</style>
<template>
  <DefaultLayout>
    <div class="container mt-4">
      <h2>Tra cứu chuyến xe</h2>
      <form @submit.prevent="searchTrips" class="mb-4">
        <div class="row">
          <div class="col-md-4">
            <label class="form-label">Điểm đi</label>
            <select v-model="searchForm.diemDi" class="form-control" required>
              <option v-for="tuyenXe in tuyenXes" :key="tuyenXe._id" :value="tuyenXe.diemDi">{{ tuyenXe.diemDi }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Điểm đến</label>
            <select v-model="searchForm.diemDen" class="form-control" required>
              <option v-for="tuyenXe in tuyenXes" :key="tuyenXe._id" :value="tuyenXe.diemDen">{{ tuyenXe.diemDen }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Ngày khởi hành</label>
            <input v-model="searchForm.ngayKhoiHanh" type="date" class="form-control" required />
          </div>
        </div>
        <button type="submit" class="btn btn-primary mt-3">Tìm kiếm</button>
      </form>
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <div v-else-if="store.chuyenXes.length === 0" class="alert alert-info">Không tìm thấy chuyến xe.</div>
      <div v-else class="row">
        <div v-for="chuyenXe in store.chuyenXes" :key="chuyenXe._id" class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ chuyenXe.tuyenXeId.diemDi }} - {{ chuyenXe.tuyenXeId.diemDen }}</h5>
              <p class="card-text">
                Thời gian: {{ new Date(chuyenXe.thoiGianKhoiHanh).toLocaleString('vi-VN') }}<br />
                Giá: {{ chuyenXe.gia.toLocaleString('vi-VN') }} VNĐ<br />
                Xe: {{ chuyenXe.xeId.bienSoXe }}<br />
                Tài xế: {{ chuyenXe.taiXeId.hoVaTen }}
              </p>
              <button class="btn btn-success" @click="bookTicket(chuyenXe._id)">Đặt vé</button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
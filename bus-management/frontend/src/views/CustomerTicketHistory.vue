<template>
  <DefaultLayout>
    <div class="container mt-4">
      <h2>Lịch sử vé xe</h2>
      <div class="mb-2 text-muted">Xem danh sách các vé xe đã đặt và trạng thái của chúng.</div>
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Mã vé</th>
            <th>Mã số ghế</th>
            <th>Trạng thái</th>
            <th>Ngày thay đổi</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in lichSuVe" :key="item._id">
            <td>{{ item.veXeId }}</td>
            <td>{{ item.maSoGhe || '-' }}</td>
            <td><span class="badge bg-primary">{{ item.trangThai }}</span></td>
            <td>{{ new Date(item.ngayThayDoi).toLocaleString('vi-VN') }}</td>
            <td>{{ item.ghiChu }}</td>
            <td>
              <button v-if="['Paid','Completed'].includes(item.trangThai)" class="btn btn-sm btn-success" @click="openDanhGiaModal(item)">Đánh giá</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Modal Đánh giá -->
      <DanhGiaForm :modal-id="'danhGiaModal'" :danh-gia="danhGiaFormData" @saved="onDanhGiaSaved" />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import DanhGiaForm from '../components/DanhGiaForm.vue';
import { Modal } from 'bootstrap';
import { useAuthStore } from '../stores/auth';

const toast = useToast();
const lichSuVe = ref([]);
const loading = ref(false);
const danhGiaFormData = ref(null);
const authStore = useAuthStore();

const fetchLichSuVe = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lichsuve/customer`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
    lichSuVe.value = response.data.data.map(item => ({
      ...item,
      maSoGhe: item.veXeId?.maSoGhe || undefined,
      veXeId: item.veXeId?._id || item.veXeId,
      chuyenXeId: item.veXeId?.chuyenXeId?._id || item.veXeId?.chuyenXeId,
      nhaXeId: item.veXeId?.xeId?.nhaXeId || undefined,
      khachHangId: item.veXeId?.khachHangId?._id || undefined
    }));
  } catch (error) {
    toast.error(error.response?.data?.error || 'Lỗi khi tải lịch sử vé');
  } finally {
    loading.value = false;
  }
};

const openDanhGiaModal = (item) => {
  danhGiaFormData.value = {
    khachHangId: authStore.user?.khachHangId || item.khachHangId,
    chuyenXeId: item.chuyenXeId,
    nhaXeId: item.nhaXeId,
    soSao: 5,
    noiDung: ''
  };
  const modalElement = document.getElementById('danhGiaModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const onDanhGiaSaved = () => {
  toast.success('Đánh giá thành công!');
  fetchLichSuVe();
};

onMounted(fetchLichSuVe);
</script>
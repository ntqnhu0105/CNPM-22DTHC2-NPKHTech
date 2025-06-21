<template>
  <DefaultLayout>
    <div class="container mt-4">
      <h2>Lịch sử đặt vé</h2>
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Chuyến xe</th>
            <th>Số ghế</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="veXe in veXes" :key="veXe._id">
            <td>{{ veXe.chuyenXeId.tuyenXeId.diemDi }} - {{ veXe.chuyenXeId.tuyenXeId.diemDen }}</td>
            <td>{{ veXe.soGhe }}</td>
            <td>{{ new Date(veXe.createdAt).toLocaleString('vi-VN') }}</td>
            <td>{{ veXe.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const toast = useToast();
const veXes = ref([]);
const loading = ref(false);

const fetchTickets = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`.${import.meta.env.VITE_API_BASE_URL}/lichsuve`);
    veXes.value = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Lỗi khi tải lịch sử vé vé');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTickets);
</script>
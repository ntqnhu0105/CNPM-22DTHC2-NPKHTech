import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useTuyenXeStore = defineStore('tuyenXe', {
  state: () => ({
    tuyenXes: [],
    pagination: { total: 0, page: 1, limit: 10 },
    loading: false,
  }),
  actions: {
    async fetchTuyenXes(page = 1, limit = 10) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tuyenxe`, {
          params: { page, limit },
        });
        this.tuyenXes = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi tải tuyến xe');
      } finally {
        this.loading = false;
      }
    },
    async createTuyenXe(data) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tuyenxe`, data);
        toast.success(response.data.message || 'Tạo tuyến xe thành công');
        await this.fetchTuyenXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi tạo tuyến xe');
      }
    },
    async updateTuyenXe(id, data) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/tuyenxe/${id}`, data);
        toast.success(response.data.message || 'Cập nhật tuyến xe thành công');
        await this.fetchTuyenXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi cập nhật tuyến xe');
      }
    },
    async deleteTuyenXe(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tuyenxe/${id}`);
        toast.success(response.data.message || 'Xóa tuyến xe thành công');
        await this.fetchTuyenXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi xóa tuyến xe');
      }
    },
  },
});
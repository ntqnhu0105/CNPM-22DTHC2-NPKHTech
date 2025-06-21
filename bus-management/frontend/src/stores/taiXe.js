import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useTaiXeStore = defineStore('taiXe', {
  state: () => ({
    taiXes: [],
    pagination: { total: 0, page: 1, limit: 10 },
    loading: false,
  }),
  actions: {
    async fetchTaiXes(page = 1, limit = 10) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/taixe`, {
          params: { page, limit },
        });
        this.taiXes = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi tải tài xế');
      } finally {
        this.loading = false;
      }
    },
    async createTaiXe(data) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/taixe`, data);
        toast.success(response.data.message || 'Tạo tài xế thành công');
        await this.fetchTaiXes();
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi tạo tài xế');
      }
    },
    async updateTaiXe(id, data) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/taixe/${id}`, data);
        toast.success(response.data.message || 'Cập nhật tài xế thành công');
        await this.fetchTaiXes();
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi cập nhật tài xế');
      }
    },
    async deleteTaiXe(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/taixe/${id}`);
        toast.success(response.data.message || 'Xóa tài xế thành công');
        await this.fetchTaiXes();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi xóa tài xế');
      }
    },
  },
});
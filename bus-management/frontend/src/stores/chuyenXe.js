import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useChuyenXeStore = defineStore('chuyenXe', {
  state: () => ({
    chuyenXes: [],
    pagination: { total: 0, page: 1, limit: 10 },
    loading: false,
  }),
  actions: {
    async fetchChuyenXes(page = 1, limit = 10) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chuyenxe`, {
          params: { page, limit },
        });
        this.chuyenXes = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi tải chuyến xe');
      } finally {
        this.loading = false;
      }
    },
    async createChuyenXe(data) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chuyenxe`, data);
        toast.success(response.data.message);
        await this.fetchChuyenXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi tạo chuyến xe');
      }
    },
    async updateChuyenXe(id, data) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/chuyenxe/${id}`, data);
        toast.success(response.data.message);
        await this.fetchChuyenXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi cập nhật chuyến xe');
      }
    },
    async deleteChuyenXe(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/chuyenxe/${id}`);
        toast.success(response.data.message);
        await this.fetchChuyenXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi xóa chuyến xe');
      }
    },
  },
});
import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useLoaiXeStore = defineStore('loaiXe', {
  state: () => ({
    loaiXes: [],
    pagination: { total: 0, page: 1, limit: 10 },
    loading: false,
  }),
  actions: {
    async fetchLoaiXes(page = 1, limit = 10) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/loaixe`, {
          params: { page, limit },
        });
        this.loaiXes = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi tải loại xe');
      } finally {
        this.loading = false;
      }
    },
    async createLoaiXe(data) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/loaixe`, data);
        toast.success(response.data.message || 'Tạo loại xe thành công');
        await this.fetchLoaiXes();
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi tạo loại xe');
      }
    },
    async updateLoaiXe(id, data) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/loaixe/${id}`, data);
        toast.success(response.data.message || 'Cập nhật loại xe thành công');
        await this.fetchLoaiXes();
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi cập nhật loại xe');
      }
    },
    async deleteLoaiXe(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/loaixe/${id}`);
        toast.success(response.data.message || 'Xóa loại xe thành công');
        await this.fetchLoaiXes();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi xóa loại xe');
      }
    },
  },
});
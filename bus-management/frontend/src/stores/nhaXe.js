import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useNhaXeStore = defineStore('nhaXe', {
  state: () => ({
    nhaXes: [],
    pagination: { total: 0, page: 1, limit: 10 },
    loading: false,
  }),
  actions: {
    async fetchNhaXes(page = 1, limit = 10) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/nhaxe`, {
          params: { page, limit },
        });
        this.nhaXes = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi tải nhà xe');
      } finally {
        this.loading = false;
      }
    },
    async createNhaXe(data) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/nhaxe`, data);
        toast.success(response.data.message || 'Tạo nhà xe thành công');
        await this.fetchNhaXes();
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi tạo nhà xe');
      }
    },
    async updateNhaXe(id, data) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/nhaxe/${id}`, data);
        toast.success(response.data.message || 'Cập nhật nhà xe thành công');
        await this.fetchNhaXes();
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi cập nhật nhà xe');
      }
    },
    async deleteNhaXe(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/nhaxe/${id}`);
        toast.success(response.data.message || 'Xóa nhà xe thành công');
        await this.fetchNhaXes();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi xóa nhà xe');
      }
    },
  },
});
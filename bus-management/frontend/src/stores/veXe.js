import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useVeXeStore = defineStore('veXe', {
  state: () => ({
    veXes: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchVeXes(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vexe?page=${page}&limit=${this.pagination.limit}`);
        this.veXes = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách vé xe');
        console.error('Error fetching veXes:', error);
      } finally {
        this.loading = false;
      }
    },

    async createVeXe(veXeData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/vexe`, veXeData);
        toast.success('Tạo vé xe thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo vé xe');
        throw error;
      }
    },

    async updateVeXe(id, veXeData) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/vexe/${id}`, veXeData);
        toast.success('Cập nhật vé xe thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật vé xe');
        throw error;
      }
    },

    async deleteVeXe(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/vexe/${id}`);
        toast.success('Xóa vé xe thành công');
        this.fetchVeXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa vé xe');
        throw error;
      }
    },

    async getVeXeById(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vexe/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin vé xe');
        throw error;
      }
    }
  }
}); 
import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useLichSuVeXeStore = defineStore('lichSuVeXe', {
  state: () => ({
    lichSuVeXes: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchLichSuVeXes(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lichsuvex?page=${page}&limit=${this.pagination.limit}`);
        this.lichSuVeXes = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách lịch sử vé xe');
        console.error('Error fetching lichSuVeXes:', error);
      } finally {
        this.loading = false;
      }
    },

    async createLichSuVeXe(lichSuVeXeData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/lichsuvex`, lichSuVeXeData);
        toast.success('Tạo lịch sử vé xe thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo lịch sử vé xe');
        throw error;
      }
    },

    async updateLichSuVeXe(id, lichSuVeXeData) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/lichsuvex/${id}`, lichSuVeXeData);
        toast.success('Cập nhật lịch sử vé xe thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật lịch sử vé xe');
        throw error;
      }
    },

    async deleteLichSuVeXe(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/lichsuvex/${id}`);
        toast.success('Xóa lịch sử vé xe thành công');
        this.fetchLichSuVeXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa lịch sử vé xe');
        throw error;
      }
    },

    async getLichSuVeXeById(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lichsuvex/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin lịch sử vé xe');
        throw error;
      }
    }
  }
}); 
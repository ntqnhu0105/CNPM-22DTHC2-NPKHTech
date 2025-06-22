import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useCSKHStore = defineStore('cskh', {
  state: () => ({
    cskhs: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchCSKHs(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cskh?page=${page}&limit=${this.pagination.limit}`);
        this.cskhs = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách CSKH');
        console.error('Error fetching cskhs:', error);
      } finally {
        this.loading = false;
      }
    },

    async createCSKH(cskhData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/cskh`, cskhData);
        toast.success('Tạo CSKH thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo CSKH');
        throw error;
      }
    },

    async updateCSKH(id, cskhData) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/cskh/${id}`, cskhData);
        toast.success('Cập nhật CSKH thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật CSKH');
        throw error;
      }
    },

    async deleteCSKH(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cskh/${id}`);
        toast.success('Xóa CSKH thành công');
        this.fetchCSKHs(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa CSKH');
        throw error;
      }
    },

    async getCSKHById(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cskh/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin CSKH');
        throw error;
      }
    }
  }
}); 
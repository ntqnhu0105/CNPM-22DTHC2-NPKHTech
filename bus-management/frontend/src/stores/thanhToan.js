import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useThanhToanStore = defineStore('thanhToan', {
  state: () => ({
    thanhToans: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchThanhToans(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/thanhtoan?page=${page}&limit=${this.pagination.limit}`);
        this.thanhToans = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách thanh toán');
        console.error('Error fetching thanhToans:', error);
      } finally {
        this.loading = false;
      }
    },

    async createThanhToan(thanhToanData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/thanhtoan`, thanhToanData);
        toast.success('Tạo thanh toán thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo thanh toán');
        throw error;
      }
    },

    async updateThanhToan(id, thanhToanData) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/thanhtoan/${id}`, thanhToanData);
        toast.success('Cập nhật thanh toán thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thanh toán');
        throw error;
      }
    },

    async deleteThanhToan(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/thanhtoan/${id}`);
        toast.success('Xóa thanh toán thành công');
        this.fetchThanhToans(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa thanh toán');
        throw error;
      }
    },

    async getThanhToanById(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/thanhtoan/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin thanh toán');
        throw error;
      }
    }
  }
}); 
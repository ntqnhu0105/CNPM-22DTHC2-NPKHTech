import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useDanhGiaStore = defineStore('danhGia', {
  state: () => ({
    danhGias: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchDanhGias(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/danhgia?page=${page}&limit=${this.pagination.limit}`);
        this.danhGias = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách đánh giá');
        console.error('Error fetching danhGias:', error);
      } finally {
        this.loading = false;
      }
    },

    async createDanhGia(danhGiaData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/danhgia`, danhGiaData);
        toast.success('Tạo đánh giá thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo đánh giá');
        throw error;
      }
    },

    async updateDanhGia(id, danhGiaData) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/danhgia/${id}`, danhGiaData);
        toast.success('Cập nhật đánh giá thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật đánh giá');
        throw error;
      }
    },

    async deleteDanhGia(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/danhgia/${id}`);
        toast.success('Xóa đánh giá thành công');
        this.fetchDanhGias(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa đánh giá');
        throw error;
      }
    },

    async getDanhGiaById(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/danhgia/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin đánh giá');
        throw error;
      }
    }
  }
}); 
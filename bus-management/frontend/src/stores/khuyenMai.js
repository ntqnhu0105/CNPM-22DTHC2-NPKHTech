import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useKhuyenMaiStore = defineStore('khuyenMai', {
  state: () => ({
    khuyenMais: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchKhuyenMais(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/khuyenmai?page=${page}&limit=${this.pagination.limit}`);
        this.khuyenMais = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách khuyến mãi');
        console.error('Error fetching khuyenMais:', error);
      } finally {
        this.loading = false;
      }
    },

    async createKhuyenMai(khuyenMaiData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/khuyenmai`, khuyenMaiData);
        toast.success('Tạo khuyến mãi thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo khuyến mãi');
        throw error;
      }
    },

    async updateKhuyenMai(id, khuyenMaiData) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/khuyenmai/${id}`, khuyenMaiData);
        toast.success('Cập nhật khuyến mãi thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật khuyến mãi');
        throw error;
      }
    },

    async deleteKhuyenMai(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/khuyenmai/${id}`);
        toast.success('Xóa khuyến mãi thành công');
        this.fetchKhuyenMais(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa khuyến mãi');
        throw error;
      }
    },

    async getKhuyenMaiById(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/khuyenmai/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin khuyến mãi');
        throw error;
      }
    }
  }
}); 
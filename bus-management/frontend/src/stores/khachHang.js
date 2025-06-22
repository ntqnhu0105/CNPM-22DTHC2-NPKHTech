import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useKhachHangStore = defineStore('khachHang', {
  state: () => ({
    khachHangs: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchKhachHangs(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/khachhang?page=${page}&limit=${this.pagination.limit}`);
        this.khachHangs = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách khách hàng');
        console.error('Error fetching khachHangs:', error);
      } finally {
        this.loading = false;
      }
    },

    async createKhachHang(khachHangData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/khachhang`, khachHangData);
        toast.success('Tạo khách hàng thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo khách hàng');
        throw error;
      }
    },

    async updateKhachHang(id, khachHangData) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/khachhang/${id}`, khachHangData);
        toast.success('Cập nhật khách hàng thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật khách hàng');
        throw error;
      }
    },

    async deleteKhachHang(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/khachhang/${id}`);
        toast.success('Xóa khách hàng thành công');
        this.fetchKhachHangs(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa khách hàng');
        throw error;
      }
    },

    async getKhachHangById(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/khachhang/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin khách hàng');
        throw error;
      }
    }
  }
}); 
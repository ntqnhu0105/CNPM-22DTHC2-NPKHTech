import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const API_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('Bạn chưa đăng nhập hoặc phiên đã hết hạn.');
    throw new Error('No auth token');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

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
        const response = await axios.get(`${API_URL}/vexe?page=${page}&limit=${this.pagination.limit}`, getAuthHeaders());
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
        const response = await axios.post(`${API_URL}/vexe/admin`, veXeData, getAuthHeaders());
        toast.success('Tạo vé xe thành công');
        this.fetchVeXes(this.pagination.page);
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo vé xe');
        throw error;
      }
    },

    async updateVeXe(id, veXeData) {
      try {
        const response = await axios.put(`${API_URL}/vexe/${id}`, veXeData, getAuthHeaders());
        toast.success('Cập nhật vé xe thành công');
        this.fetchVeXes(this.pagination.page);
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật vé xe');
        throw error;
      }
    },

    async deleteVeXe(id) {
      try {
        await axios.delete(`${API_URL}/vexe/${id}`, getAuthHeaders());
        toast.success('Xóa vé xe thành công');
        this.fetchVeXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa vé xe');
        throw error;
      }
    },

    async getVeXeById(id) {
      try {
        const response = await axios.get(`${API_URL}/vexe/${id}`, getAuthHeaders());
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin vé xe');
        throw error;
      }
    },

    async cancelVeXe(id, lyDoHuy = '') {
      try {
        await axios.post(`${API_URL}/vexe/${id}/cancel`, { lyDoHuy }, getAuthHeaders());
        toast.success('Hủy vé thành công');
        this.fetchVeXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi hủy vé');
        throw error;
      }
    }
  }
}); 
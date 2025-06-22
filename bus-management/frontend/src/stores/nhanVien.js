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

export const useNhanVienStore = defineStore('nhanVien', {
  state: () => ({
    nhanViens: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchNhanViens(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/nhanvien?page=${page}&limit=${this.pagination.limit}`);
        this.nhanViens = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách nhân viên');
        console.error('Error fetching nhanViens:', error);
      } finally {
        this.loading = false;
      }
    },

    async createNhanVien(nhanVienData) {
      try {
        const response = await axios.post(`${API_URL}/nhanvien`, nhanVienData, getAuthHeaders());
        toast.success('Tạo nhân viên thành công');
        this.fetchNhanViens();
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo nhân viên');
        throw error;
      }
    },

    async updateNhanVien(id, nhanVienData) {
      try {
        const response = await axios.put(`${API_URL}/nhanvien/${id}`, nhanVienData, getAuthHeaders());
        toast.success('Cập nhật nhân viên thành công');
        this.fetchNhanViens(this.pagination.page);
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật nhân viên');
        throw error;
      }
    },

    async deleteNhanVien(id) {
      try {
        await axios.delete(`${API_URL}/nhanvien/${id}`, getAuthHeaders());
        toast.success('Xóa nhân viên thành công');
        this.fetchNhanViens(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa nhân viên');
        throw error;
      }
    },

    async getNhanVienById(id) {
      try {
        const response = await axios.get(`${API_URL}/nhanvien/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin nhân viên');
        throw error;
      }
    }
  }
}); 
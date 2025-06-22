import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useThongBaoStore = defineStore('thongBao', {
  state: () => ({
    thongBaos: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchThongBaos(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/thongbao?page=${page}&limit=${this.pagination.limit}`);
        this.thongBaos = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        toast.error('Lỗi khi tải danh sách thông báo');
        console.error('Error fetching thongBaos:', error);
      } finally {
        this.loading = false;
      }
    },

    async createThongBao(thongBaoData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/thongbao`, thongBaoData);
        toast.success('Tạo thông báo thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi tạo thông báo');
        throw error;
      }
    },

    async updateThongBao(id, thongBaoData) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/thongbao/${id}`, thongBaoData);
        toast.success('Cập nhật thông báo thành công');
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thông báo');
        throw error;
      }
    },

    async deleteThongBao(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/thongbao/${id}`);
        toast.success('Xóa thông báo thành công');
        this.fetchThongBaos(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa thông báo');
        throw error;
      }
    },

    async getThongBaoById(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/thongbao/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin thông báo');
        throw error;
      }
    }
  }
}); 
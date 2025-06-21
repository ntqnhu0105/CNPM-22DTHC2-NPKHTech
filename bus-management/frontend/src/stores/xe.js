import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useXeStore = defineStore('xe', {
  state: () => ({
    xes: [],
    pagination: { total: 0, page: 1, limit: 10 },
    loading: false,
    nhaXes: [],
    loaiXes: [],
  }),
  actions: {
    async fetchXes(page = 1, limit = 10) {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/xe`, {
          params: { page, limit },
        });
        this.xes = response.data.data;
        this.pagination = response.data.pagination;
      } catch (error) {
        console.error('fetchXes error:', error.response?.data || error);
        toast.error(error.response?.data?.error || 'Lỗi khi tải xe');
      } finally {
        this.loading = false;
      }
    },
    async fetchDependencies() {
      this.loading = true;
      try {
        const [nhaXeRes, loaiXeRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/nhaxe`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/loaixe`),
        ]);
        console.log('nhaXes:', nhaXeRes.data.data);
        console.log('loaiXes:', loaiXeRes.data.data);
        this.nhaXes = nhaXeRes.data.data;
        this.loaiXes = loaiXeRes.data.data;
        if (this.loaiXes.length === 0) {
          toast.warning('Không có loại xe nào được tìm thấy');
        }
      } catch (error) {
        console.error('fetchDependencies error:', error.response?.data || error);
        toast.error(error.response?.data?.error || 'Lỗi khi tải dữ liệu phụ thuộc');
      } finally {
        this.loading = false;
      }
    },
    async createXe(data) {
      try {
        console.log('createXe data:', data);
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/xe`, data);
        toast.success(response.data.message || 'Tạo xe thành công');
        await this.fetchXes(this.pagination.page);
      } catch (error) {
        console.error('createXe error:', error.response?.data || error);
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi tạo xe');
      }
    },
    async updateXe(id, data) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/xe/${id}`, data);
        toast.success(response.data.message || 'Cập nhật xe thành công');
        await this.fetchXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi cập nhật xe');
      }
    },
    async deleteXe(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/xe/${id}`);
        toast.success(response.data.message || 'Xóa xe thành công');
        await this.fetchXes(this.pagination.page);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Lỗi khi xóa xe');
      }
    },
  },
});
import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useSoGheSoGiuongStore = defineStore('soGheSoGiuong', {
  state: () => ({
    soGheSoGiuongs: [],
    pagination: { total: 0, page: 1, limit: 100 },
    loading: false,
    xes: [],
    selectedXe: null,
  }),
  actions: {
    async fetchSoGheSoGiuongs(page = 1, limit = 100, xeId = null) {
  this.loading = true;
  try {
    console.log('Fetching seats with params:', { page, limit, xeId });
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/soghe-sogiuong`, {
      params: { page, limit, xeId },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    this.soGheSoGiuongs = response.data.data;
    this.pagination = response.data.pagination;
    if (xeId) {
      this.selectedXe = this.xes.find(xe => xe._id === xeId) || (this.soGheSoGiuongs.length > 0 ? this.soGheSoGiuongs[0].xeId : null);
      if (!this.selectedXe) {
        console.warn('Selected vehicle not found for xeId:', xeId);
        toast.warning('Không tìm thấy thông tin xe');
      }
    }
    console.log('Fetched seats:', this.soGheSoGiuongs);
  } catch (error) {
    console.error('fetchSoGheSoGiuongs error:', error.response?.data || error);
    toast.error(error.response?.data?.error || 'Lỗi khi tải số ghế/số giường');
  } finally {
    this.loading = false;
  }
},
    async fetchDependencies() {
      this.loading = true;
      try {
        console.log('Fetching dependencies (vehicles)');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/xe`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.xes = response.data.data;
        if (this.xes.length === 0) {
          toast.warning('Không có xe nào được tìm thấy');
        }
        console.log('Fetched vehicles:', this.xes);
      } catch (error) {
        console.error('fetchDependencies error:', error.response?.data || error);
        toast.error(error.response?.data?.error || 'Lỗi khi tải dữ liệu xe');
      } finally {
        this.loading = false;
      }
    },
    async createSoGheSoGiuong(data) {
      try {
        console.log('Sending createSoGheSoGiuong data:', data);
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/soghe-sogiuong`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success(response.data.message || 'Tạo số ghế/số giường thành công');
        await this.fetchSoGheSoGiuongs(1, 100, data.xeId);
      } catch (error) {
        console.error('createSoGheSoGiuong error:', error.response?.data || error);
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi tạo số ghế/số giường');
        throw error;
      }
    },
    async bulkCreateSoGheSoGiuong(xeId, soGhe, force = false) {
  try {
    console.log('Sending bulkCreateSoGheSoGiuong data:', { xeId, soGhe, force });
    console.log('Token:', localStorage.getItem('token'));
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/soghe-sogiuong/bulk`, { xeId, soGhe, force }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    toast.success(response.data.message || 'Tạo hàng loạt số ghế/số giường thành công');
    await this.fetchSoGheSoGiuongs(1, 100, xeId);
  } catch (error) {
    console.error('bulkCreateSoGheSoGiuong error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    if (error.response?.status === 401) {
      toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      window.location.href = '/login';
    } else {
      toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi tạo hàng loạt số ghế/số giường');
    }
    throw error;
  }
},
    async updateSoGheSoGiuong(id, data) {
      try {
        console.log('Sending updateSoGheSoGiuong data:', { id, ...data });
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/soghe-sogiuong/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success(response.data.message || 'Cập nhật số ghế/số giường thành công');
        await this.fetchSoGheSoGiuongs(1, 100, data.xeId);
      } catch (error) {
        console.error('updateSoGheSoGiuong error:', error.response?.data || error);
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi cập nhật số ghế/số giường');
        throw error;
      }
    },
    async deleteSoGheSoGiuong(id) {
      try {
        console.log('Deleting seat with id:', id);
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/soghe-sogiuong/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success(response.data.message || 'Xóa số ghế/số giường thành công');
        await this.fetchSoGheSoGiuongs(1, 100, this.selectedXe?._id);
      } catch (error) {
        console.error('deleteSoGheSoGiuong error:', error.response?.data || error);
        toast.error(error.response?.data?.error || 'Lỗi khi xóa số ghế/số giường');
        throw error;
      }
    },
    async deleteAllSoGheSoGiuongByXeId(xeId) {
      try {
        console.log('Sending deleteAllSoGheSoGiuongByXeId:', xeId);
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/soghe-sogiuong/by-xe-id/${xeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success(response.data.message || 'Xóa tất cả số ghế/số giường thành công');
        await this.fetchSoGheSoGiuongs(1, 100, xeId);
      } catch (error) {
        console.error('deleteAllSoGheSoGiuongByXeId error:', error.response?.data || error);
        toast.error(error.response?.data?.error || 'Lỗi khi xóa tất cả số ghế/số giường');
        throw error;
      }
    },
  },
});
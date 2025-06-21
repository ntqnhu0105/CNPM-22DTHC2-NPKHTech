// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.role, // Getter for user role
  },
  actions: {
    async register(credentials) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, credentials);
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        return response.data; // Contains the newly created user
      } catch (error) {
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Đăng ký thất bại');
        throw error;
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, credentials);
        this.user = response.data.user; // Ensure user contains role
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        toast.success('Đăng nhập thành công!');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Đăng nhập thất bại');
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      toast.info('Đã đăng xuất.');
    },
  },
});
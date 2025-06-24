// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.role,
  },
  actions: {
    async register(credentials) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, credentials);
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        return response.data;
      } catch (error) {
        console.error('Register error:', error.response?.data); // Debug log
        toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Đăng ký thất bại');
        throw error;
      }
    },
    async login({ username, password }) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { username, password });
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        toast.success('Đăng nhập thành công!');
      } catch (error) {
        console.error('Login error:', error.response?.data); // Debug log
        toast.error(error.response?.data?.error || 'Đăng nhập thất bại');
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      toast.info('Đã đăng xuất.');
    },
  },
});
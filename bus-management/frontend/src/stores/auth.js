import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return response.data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    async register(userData) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', userData)
        return response.data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    async logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/me')
        this.user = response.data
        return response.data
      } catch (error) {
        this.logout()
        throw error.response?.data || error.message
      }
    },

    initializeAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.fetchUser()
      }
    }
  }
}) 
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const reviewService = {
  async getAllReviews(params = {}) {
    const response = await axios.get(`${API_URL}/danhgia`, { params })
    return response.data
  },

  async getReviewById(id) {
    const response = await axios.get(`${API_URL}/danhgia/${id}`)
    return response.data
  },

  async createReview(reviewData) {
    const response = await axios.post(`${API_URL}/danhgia`, reviewData)
    return response.data
  },

  async updateReview(id, reviewData) {
    const response = await axios.put(`${API_URL}/danhgia/${id}`, reviewData)
    return response.data
  },

  async deleteReview(id) {
    const response = await axios.delete(`${API_URL}/danhgia/${id}`)
    return response.data
  },

  async getRoutes() {
    const response = await axios.get(`${API_URL}/tuyenxe`)
    return response.data
  },

  async getCustomers() {
    const response = await axios.get(`${API_URL}/khachhang`)
    return response.data
  }
} 
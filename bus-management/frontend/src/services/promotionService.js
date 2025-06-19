import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const promotionService = {
  async getAllPromotions(params = {}) {
    const response = await axios.get(`${API_URL}/khuyenmai`, { params })
    return response.data
  },

  async getPromotionById(id) {
    const response = await axios.get(`${API_URL}/khuyenmai/${id}`)
    return response.data
  },

  async createPromotion(promotionData) {
    const response = await axios.post(`${API_URL}/khuyenmai`, promotionData)
    return response.data
  },

  async updatePromotion(id, promotionData) {
    const response = await axios.put(`${API_URL}/khuyenmai/${id}`, promotionData)
    return response.data
  },

  async deletePromotion(id) {
    const response = await axios.delete(`${API_URL}/khuyenmai/${id}`)
    return response.data
  }
} 
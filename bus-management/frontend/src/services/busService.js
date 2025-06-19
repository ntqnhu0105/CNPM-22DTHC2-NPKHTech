import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const busService = {
  async getAllBuses(params = {}) {
    const response = await axios.get(`${API_URL}/xe`, { params })
    return response.data
  },

  async getBusById(id) {
    const response = await axios.get(`${API_URL}/xe/${id}`)
    return response.data
  },

  async createBus(busData) {
    const response = await axios.post(`${API_URL}/xe`, busData)
    return response.data
  },

  async updateBus(id, busData) {
    const response = await axios.put(`${API_URL}/xe/${id}`, busData)
    return response.data
  },

  async deleteBus(id) {
    const response = await axios.delete(`${API_URL}/xe/${id}`)
    return response.data
  }
} 
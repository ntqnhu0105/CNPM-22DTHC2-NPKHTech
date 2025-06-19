import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const driverService = {
  async getAllDrivers(params = {}) {
    const response = await axios.get(`${API_URL}/taixe`, { params })
    return response.data
  },

  async getDriverById(id) {
    const response = await axios.get(`${API_URL}/taixe/${id}`)
    return response.data
  },

  async createDriver(driverData) {
    const response = await axios.post(`${API_URL}/taixe`, driverData)
    return response.data
  },

  async updateDriver(id, driverData) {
    const response = await axios.put(`${API_URL}/taixe/${id}`, driverData)
    return response.data
  },

  async deleteDriver(id) {
    const response = await axios.delete(`${API_URL}/taixe/${id}`)
    return response.data
  }
} 
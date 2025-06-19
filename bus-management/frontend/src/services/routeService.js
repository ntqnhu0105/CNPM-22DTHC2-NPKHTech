import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const routeService = {
  async getAllRoutes(params = {}) {
    const response = await axios.get(`${API_URL}/tuyenxe`, { params })
    return response.data
  },

  async getRouteById(id) {
    const response = await axios.get(`${API_URL}/tuyenxe/${id}`)
    return response.data
  },

  async createRoute(routeData) {
    const response = await axios.post(`${API_URL}/tuyenxe`, routeData)
    return response.data
  },

  async updateRoute(id, routeData) {
    const response = await axios.put(`${API_URL}/tuyenxe/${id}`, routeData)
    return response.data
  },

  async deleteRoute(id) {
    const response = await axios.delete(`${API_URL}/tuyenxe/${id}`)
    return response.data
  }
} 
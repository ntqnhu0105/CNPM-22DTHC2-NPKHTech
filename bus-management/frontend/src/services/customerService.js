import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const customerService = {
  async getAllCustomers(params = {}) {
    const response = await axios.get(`${API_URL}/khachhang`, { params })
    return response.data
  },

  async getCustomerById(id) {
    const response = await axios.get(`${API_URL}/khachhang/${id}`)
    return response.data
  },

  async createCustomer(customerData) {
    const response = await axios.post(`${API_URL}/khachhang`, customerData)
    return response.data
  },

  async updateCustomer(id, customerData) {
    const response = await axios.put(`${API_URL}/khachhang/${id}`, customerData)
    return response.data
  },

  async deleteCustomer(id) {
    const response = await axios.delete(`${API_URL}/khachhang/${id}`)
    return response.data
  }
} 
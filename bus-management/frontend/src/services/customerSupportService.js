import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const customerSupportService = {
  async getAllTickets(params = {}) {
    const response = await axios.get(`${API_URL}/cskh`, { params })
    return response.data
  },

  async getTicketById(id) {
    const response = await axios.get(`${API_URL}/cskh/${id}`)
    return response.data
  },

  async createTicket(ticketData) {
    const response = await axios.post(`${API_URL}/cskh`, ticketData)
    return response.data
  },

  async updateTicket(id, ticketData) {
    const response = await axios.put(`${API_URL}/cskh/${id}`, ticketData)
    return response.data
  },

  async deleteTicket(id) {
    const response = await axios.delete(`${API_URL}/cskh/${id}`)
    return response.data
  },

  async addResponse(id, responseData) {
    const response = await axios.post(`${API_URL}/cskh/${id}/response`, responseData)
    return response.data
  },

  async getCustomers() {
    const response = await axios.get(`${API_URL}/khachhang`)
    return response.data
  }
} 
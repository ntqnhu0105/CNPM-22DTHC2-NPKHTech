import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const ticketService = {
  async getAllTickets(params = {}) {
    const response = await axios.get(`${API_URL}/vexe`, { params })
    return response.data
  },

  async getTicketById(id) {
    const response = await axios.get(`${API_URL}/vexe/${id}`)
    return response.data
  },

  async createTicket(ticketData) {
    const response = await axios.post(`${API_URL}/vexe`, ticketData)
    return response.data
  },

  async updateTicket(id, ticketData) {
    const response = await axios.put(`${API_URL}/vexe/${id}`, ticketData)
    return response.data
  },

  async deleteTicket(id) {
    const response = await axios.delete(`${API_URL}/vexe/${id}`)
    return response.data
  },

  async getRoutes() {
    const response = await axios.get(`${API_URL}/tuyenxe`)
    return response.data
  },

  async getBuses() {
    const response = await axios.get(`${API_URL}/xe`)
    return response.data
  }
} 
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const bookingService = {
  async getAllBookings(params = {}) {
    const response = await axios.get(`${API_URL}/lichsuvexe`, { params })
    return response.data
  },

  async getBookingById(id) {
    const response = await axios.get(`${API_URL}/lichsuvexe/${id}`)
    return response.data
  },

  async createBooking(bookingData) {
    const response = await axios.post(`${API_URL}/lichsuvexe`, bookingData)
    return response.data
  },

  async updateBooking(id, bookingData) {
    const response = await axios.put(`${API_URL}/lichsuvexe/${id}`, bookingData)
    return response.data
  },

  async deleteBooking(id) {
    const response = await axios.delete(`${API_URL}/lichsuvexe/${id}`)
    return response.data
  }
} 
<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Tickets</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all tickets in the system.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openModal()"
          class="btn-primary"
        >
          Add Ticket
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search tickets..."
          class="input"
          @input="handleSearch"
        />
      </div>
      <div>
        <select v-model="filterRoute" class="input" @change="handleFilter">
          <option value="">All Routes</option>
          <option v-for="route in routes" :key="route._id" :value="route._id">
            {{ route.tenTuyenXe }}
          </option>
        </select>
      </div>
      <div>
        <select v-model="filterStatus" class="input" @change="handleFilter">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Ticket ID</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Route</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Bus</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Seat/Bed</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="ticket in tickets" :key="ticket._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {{ ticket._id }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ ticket.tenTuyenXe }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ ticket.bienSoXe }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ ticket.soGhe || ticket.soGiuong }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ new Date(ticket.ngayKhoiHanh).toLocaleDateString() }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ ticket.giaVe.toLocaleString() }} VND
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      ticket.trangThai === 'available' ? 'bg-green-100 text-green-800' : 
                      ticket.trangThai === 'booked' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ ticket.trangThai }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="openModal(ticket)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteTicket(ticket._id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ editingTicket ? 'Edit Ticket' : 'Add New Ticket' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="route" class="label">Route</label>
                  <select
                    id="route"
                    v-model="form.tuyenXeId"
                    required
                    class="input"
                    @change="handleRouteChange"
                  >
                    <option value="">Select Route</option>
                    <option v-for="route in routes" :key="route._id" :value="route._id">
                      {{ route.tenTuyenXe }}
                    </option>
                  </select>
                </div>

                <div>
                  <label for="bus" class="label">Bus</label>
                  <select
                    id="bus"
                    v-model="form.xeId"
                    required
                    class="input"
                  >
                    <option value="">Select Bus</option>
                    <option v-for="bus in buses" :key="bus._id" :value="bus._id">
                      {{ bus.bienSoXe }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="seat" class="label">Seat/Bed Number</label>
                    <input
                      id="seat"
                      type="number"
                      v-model="form.soGhe"
                      required
                      min="1"
                      class="input"
                    />
                  </div>

                  <div>
                    <label for="price" class="label">Price (VND)</label>
                    <input
                      id="price"
                      type="number"
                      v-model="form.giaVe"
                      required
                      min="0"
                      class="input"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="date" class="label">Departure Date</label>
                    <input
                      id="date"
                      type="date"
                      v-model="form.ngayKhoiHanh"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label for="status" class="label">Status</label>
                    <select
                      id="status"
                      v-model="form.trangThai"
                      required
                      class="input"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {{ editingTicket ? 'Update' : 'Create' }}
                  </button>
                  <button
                    type="button"
                    @click="closeModal"
                    class="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { ticketService } from '../../services/ticketService'

const toast = useToast()
const tickets = ref([])
const routes = ref([])
const buses = ref([])
const isModalOpen = ref(false)
const editingTicket = ref(null)
const searchQuery = ref('')
const filterRoute = ref('')
const filterStatus = ref('')

const form = reactive({
  tuyenXeId: '',
  xeId: '',
  soGhe: '',
  giaVe: '',
  ngayKhoiHanh: '',
  trangThai: 'available'
})

const fetchTickets = async () => {
  try {
    const data = await ticketService.getAllTickets({
      search: searchQuery.value,
      route: filterRoute.value,
      status: filterStatus.value
    })
    tickets.value = data
  } catch (error) {
    toast.error('Failed to fetch tickets')
    console.error('Error:', error)
  }
}

const fetchRoutes = async () => {
  try {
    routes.value = await ticketService.getRoutes()
  } catch (error) {
    toast.error('Failed to fetch routes')
    console.error('Error:', error)
  }
}

const fetchBuses = async () => {
  try {
    buses.value = await ticketService.getBuses()
  } catch (error) {
    toast.error('Failed to fetch buses')
    console.error('Error:', error)
  }
}

const openModal = (ticket = null) => {
  if (ticket) {
    editingTicket.value = ticket
    form.tuyenXeId = ticket.tuyenXeId
    form.xeId = ticket.xeId
    form.soGhe = ticket.soGhe || ticket.soGiuong
    form.giaVe = ticket.giaVe
    form.ngayKhoiHanh = new Date(ticket.ngayKhoiHanh).toISOString().split('T')[0]
    form.trangThai = ticket.trangThai
  } else {
    editingTicket.value = null
    form.tuyenXeId = ''
    form.xeId = ''
    form.soGhe = ''
    form.giaVe = ''
    form.ngayKhoiHanh = ''
    form.trangThai = 'available'
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingTicket.value = null
}

const handleSubmit = async () => {
  try {
    if (editingTicket.value) {
      await ticketService.updateTicket(editingTicket.value._id, form)
      toast.success('Ticket updated successfully')
    } else {
      await ticketService.createTicket(form)
      toast.success('Ticket created successfully')
    }
    await fetchTickets()
    closeModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed')
    console.error('Error:', error)
  }
}

const deleteTicket = async (id) => {
  if (!confirm('Are you sure you want to delete this ticket?')) return
  
  try {
    await ticketService.deleteTicket(id)
    toast.success('Ticket deleted successfully')
    await fetchTickets()
  } catch (error) {
    toast.error('Failed to delete ticket')
    console.error('Error:', error)
  }
}

const handleSearch = () => {
  fetchTickets()
}

const handleFilter = () => {
  fetchTickets()
}

const handleRouteChange = () => {
  form.xeId = ''
}

onMounted(() => {
  fetchTickets()
  fetchRoutes()
  fetchBuses()
})
</script> 
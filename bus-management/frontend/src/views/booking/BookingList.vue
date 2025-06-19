<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Bookings</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all bookings in the system.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openModal()"
          class="btn-primary"
        >
          Add Booking
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search bookings..."
          class="input"
          @input="handleSearch"
        />
      </div>
      <div class="flex gap-4">
        <select v-model="filterStatus" class="input" @change="handleFilter">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
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
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Booking ID</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Route</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="booking in bookings" :key="booking._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {{ booking._id }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ booking.tenKhachHang }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ booking.tenTuyenXe }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ new Date(booking.ngayDat).toLocaleDateString() }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      booking.trangThai === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.trangThai === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ booking.trangThai }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ booking.tongTien.toLocaleString() }} VND
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="openModal(booking)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteBooking(booking._id)"
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
              {{ editingBooking ? 'Edit Booking' : 'Add New Booking' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="customerName" class="label">Customer Name</label>
                  <input
                    id="customerName"
                    type="text"
                    v-model="form.tenKhachHang"
                    required
                    class="input"
                  />
                </div>

                <div>
                  <label for="route" class="label">Route</label>
                  <input
                    id="route"
                    type="text"
                    v-model="form.tenTuyenXe"
                    required
                    class="input"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="date" class="label">Date</label>
                    <input
                      id="date"
                      type="date"
                      v-model="form.ngayDat"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label for="amount" class="label">Amount (VND)</label>
                    <input
                      id="amount"
                      type="number"
                      v-model="form.tongTien"
                      required
                      class="input"
                    />
                  </div>
                </div>

                <div>
                  <label for="status" class="label">Status</label>
                  <select
                    id="status"
                    v-model="form.trangThai"
                    required
                    class="input"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {{ editingBooking ? 'Update' : 'Create' }}
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
import { bookingService } from '../../services/bookingService'

const toast = useToast()
const bookings = ref([])
const isModalOpen = ref(false)
const editingBooking = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')

const form = reactive({
  tenKhachHang: '',
  tenTuyenXe: '',
  ngayDat: '',
  tongTien: '',
  trangThai: 'pending'
})

const fetchBookings = async () => {
  try {
    const data = await bookingService.getAllBookings({
      search: searchQuery.value,
      status: filterStatus.value
    })
    bookings.value = data
  } catch (error) {
    toast.error('Failed to fetch bookings')
    console.error('Error:', error)
  }
}

const openModal = (booking = null) => {
  if (booking) {
    editingBooking.value = booking
    form.tenKhachHang = booking.tenKhachHang
    form.tenTuyenXe = booking.tenTuyenXe
    form.ngayDat = new Date(booking.ngayDat).toISOString().split('T')[0]
    form.tongTien = booking.tongTien
    form.trangThai = booking.trangThai
  } else {
    editingBooking.value = null
    form.tenKhachHang = ''
    form.tenTuyenXe = ''
    form.ngayDat = ''
    form.tongTien = ''
    form.trangThai = 'pending'
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingBooking.value = null
}

const handleSubmit = async () => {
  try {
    if (editingBooking.value) {
      await bookingService.updateBooking(editingBooking.value._id, form)
      toast.success('Booking updated successfully')
    } else {
      await bookingService.createBooking(form)
      toast.success('Booking created successfully')
    }
    await fetchBookings()
    closeModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed')
    console.error('Error:', error)
  }
}

const deleteBooking = async (id) => {
  if (!confirm('Are you sure you want to delete this booking?')) return
  
  try {
    await bookingService.deleteBooking(id)
    toast.success('Booking deleted successfully')
    await fetchBookings()
  } catch (error) {
    toast.error('Failed to delete booking')
    console.error('Error:', error)
  }
}

const handleSearch = () => {
  fetchBookings()
}

const handleFilter = () => {
  fetchBookings()
}

onMounted(() => {
  fetchBookings()
})
</script> 
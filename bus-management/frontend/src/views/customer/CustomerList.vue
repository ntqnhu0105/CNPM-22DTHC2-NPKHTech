<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Customers</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all customers in the system.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openModal()"
          class="btn-primary"
        >
          Add Customer
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search customers..."
          class="input"
          @input="handleSearch"
        />
      </div>
      <div class="flex gap-4">
        <select v-model="filterStatus" class="input" @change="handleFilter">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Address</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Bookings</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="customer in customers" :key="customer._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {{ customer.tenKhachHang }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ customer.email }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ customer.soDienThoai }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ customer.diaChi }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      customer.trangThai === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ customer.trangThai }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ customer.soLuongDatVe || 0 }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="openModal(customer)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteCustomer(customer._id)"
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
              {{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="name" class="label">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    v-model="form.tenKhachHang"
                    required
                    class="input"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="email" class="label">Email</label>
                    <input
                      id="email"
                      type="email"
                      v-model="form.email"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label for="phone" class="label">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      v-model="form.soDienThoai"
                      required
                      class="input"
                    />
                  </div>
                </div>

                <div>
                  <label for="address" class="label">Address</label>
                  <input
                    id="address"
                    type="text"
                    v-model="form.diaChi"
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {{ editingCustomer ? 'Update' : 'Create' }}
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
import { customerService } from '../../services/customerService'

const toast = useToast()
const customers = ref([])
const isModalOpen = ref(false)
const editingCustomer = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')

const form = reactive({
  tenKhachHang: '',
  email: '',
  soDienThoai: '',
  diaChi: '',
  trangThai: 'active'
})

const fetchCustomers = async () => {
  try {
    const data = await customerService.getAllCustomers({
      search: searchQuery.value,
      status: filterStatus.value
    })
    customers.value = data
  } catch (error) {
    toast.error('Failed to fetch customers')
    console.error('Error:', error)
  }
}

const openModal = (customer = null) => {
  if (customer) {
    editingCustomer.value = customer
    form.tenKhachHang = customer.tenKhachHang
    form.email = customer.email
    form.soDienThoai = customer.soDienThoai
    form.diaChi = customer.diaChi
    form.trangThai = customer.trangThai
  } else {
    editingCustomer.value = null
    form.tenKhachHang = ''
    form.email = ''
    form.soDienThoai = ''
    form.diaChi = ''
    form.trangThai = 'active'
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingCustomer.value = null
}

const handleSubmit = async () => {
  try {
    if (editingCustomer.value) {
      await customerService.updateCustomer(editingCustomer.value._id, form)
      toast.success('Customer updated successfully')
    } else {
      await customerService.createCustomer(form)
      toast.success('Customer created successfully')
    }
    await fetchCustomers()
    closeModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed')
    console.error('Error:', error)
  }
}

const deleteCustomer = async (id) => {
  if (!confirm('Are you sure you want to delete this customer?')) return
  
  try {
    await customerService.deleteCustomer(id)
    toast.success('Customer deleted successfully')
    await fetchCustomers()
  } catch (error) {
    toast.error('Failed to delete customer')
    console.error('Error:', error)
  }
}

const handleSearch = () => {
  fetchCustomers()
}

const handleFilter = () => {
  fetchCustomers()
}

onMounted(() => {
  fetchCustomers()
})
</script> 
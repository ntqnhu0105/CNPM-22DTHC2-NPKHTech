<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Drivers</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all drivers in the system.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openModal()"
          class="btn-primary"
        >
          Add Driver
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search drivers..."
          class="input"
          @input="handleSearch"
        />
      </div>
      <div class="flex gap-4">
        <select v-model="filterStatus" class="input" @change="handleFilter">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="on_trip">On Trip</option>
          <option value="off_duty">Off Duty</option>
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
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">License Number</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Experience</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="driver in drivers" :key="driver._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {{ driver.tenTaiXe }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ driver.bangLai }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ driver.soDienThoai }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ driver.kinhNghiem }} years</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      driver.trangThai === 'available' ? 'bg-green-100 text-green-800' : 
                      driver.trangThai === 'on_trip' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ driver.trangThai }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="flex items-center">
                      {{ driver.rating || 0 }}/5
                      <svg class="h-5 w-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="openModal(driver)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteDriver(driver._id)"
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
              {{ editingDriver ? 'Edit Driver' : 'Add New Driver' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="name" class="label">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    v-model="form.tenTaiXe"
                    required
                    class="input"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="license" class="label">License Number</label>
                    <input
                      id="license"
                      type="text"
                      v-model="form.bangLai"
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

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="experience" class="label">Experience (years)</label>
                    <input
                      id="experience"
                      type="number"
                      v-model="form.kinhNghiem"
                      required
                      min="0"
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
                      <option value="on_trip">On Trip</option>
                      <option value="off_duty">Off Duty</option>
                    </select>
                  </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {{ editingDriver ? 'Update' : 'Create' }}
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
import { driverService } from '../../services/driverService'

const toast = useToast()
const drivers = ref([])
const isModalOpen = ref(false)
const editingDriver = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')

const form = reactive({
  tenTaiXe: '',
  bangLai: '',
  soDienThoai: '',
  kinhNghiem: '',
  trangThai: 'available'
})

const fetchDrivers = async () => {
  try {
    const data = await driverService.getAllDrivers({
      search: searchQuery.value,
      status: filterStatus.value
    })
    drivers.value = data
  } catch (error) {
    toast.error('Failed to fetch drivers')
    console.error('Error:', error)
  }
}

const openModal = (driver = null) => {
  if (driver) {
    editingDriver.value = driver
    form.tenTaiXe = driver.tenTaiXe
    form.bangLai = driver.bangLai
    form.soDienThoai = driver.soDienThoai
    form.kinhNghiem = driver.kinhNghiem
    form.trangThai = driver.trangThai
  } else {
    editingDriver.value = null
    form.tenTaiXe = ''
    form.bangLai = ''
    form.soDienThoai = ''
    form.kinhNghiem = ''
    form.trangThai = 'available'
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingDriver.value = null
}

const handleSubmit = async () => {
  try {
    if (editingDriver.value) {
      await driverService.updateDriver(editingDriver.value._id, form)
      toast.success('Driver updated successfully')
    } else {
      await driverService.createDriver(form)
      toast.success('Driver created successfully')
    }
    await fetchDrivers()
    closeModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed')
    console.error('Error:', error)
  }
}

const deleteDriver = async (id) => {
  if (!confirm('Are you sure you want to delete this driver?')) return
  
  try {
    await driverService.deleteDriver(id)
    toast.success('Driver deleted successfully')
    await fetchDrivers()
  } catch (error) {
    toast.error('Failed to delete driver')
    console.error('Error:', error)
  }
}

const handleSearch = () => {
  fetchDrivers()
}

const handleFilter = () => {
  fetchDrivers()
}

onMounted(() => {
  fetchDrivers()
})
</script> 
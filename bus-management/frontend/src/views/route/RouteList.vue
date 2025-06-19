<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Routes</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all bus routes in the system.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openModal()"
          class="btn-primary"
        >
          Add Route
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search routes..."
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
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Route Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">From</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">To</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Distance (km)</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Duration</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="route in routes" :key="route._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {{ route.tenTuyenXe }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ route.diemDi }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ route.diemDen }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ route.khoangCach }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ route.thoiGianDi }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      route.trangThai === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ route.trangThai }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="openModal(route)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteRoute(route._id)"
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
              {{ editingRoute ? 'Edit Route' : 'Add New Route' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="routeName" class="label">Route Name</label>
                  <input
                    id="routeName"
                    type="text"
                    v-model="form.tenTuyenXe"
                    required
                    class="input"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="from" class="label">From</label>
                    <input
                      id="from"
                      type="text"
                      v-model="form.diemDi"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label for="to" class="label">To</label>
                    <input
                      id="to"
                      type="text"
                      v-model="form.diemDen"
                      required
                      class="input"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="distance" class="label">Distance (km)</label>
                    <input
                      id="distance"
                      type="number"
                      v-model="form.khoangCach"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label for="duration" class="label">Duration (hours)</label>
                    <input
                      id="duration"
                      type="text"
                      v-model="form.thoiGianDi"
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {{ editingRoute ? 'Update' : 'Create' }}
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
import { routeService } from '../../services/routeService'

const toast = useToast()
const routes = ref([])
const isModalOpen = ref(false)
const editingRoute = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')

const form = reactive({
  tenTuyenXe: '',
  diemDi: '',
  diemDen: '',
  khoangCach: '',
  thoiGianDi: '',
  trangThai: 'active'
})

const fetchRoutes = async () => {
  try {
    const data = await routeService.getAllRoutes({
      search: searchQuery.value,
      status: filterStatus.value
    })
    routes.value = data
  } catch (error) {
    toast.error('Failed to fetch routes')
    console.error('Error:', error)
  }
}

const openModal = (route = null) => {
  if (route) {
    editingRoute.value = route
    form.tenTuyenXe = route.tenTuyenXe
    form.diemDi = route.diemDi
    form.diemDen = route.diemDen
    form.khoangCach = route.khoangCach
    form.thoiGianDi = route.thoiGianDi
    form.trangThai = route.trangThai
  } else {
    editingRoute.value = null
    form.tenTuyenXe = ''
    form.diemDi = ''
    form.diemDen = ''
    form.khoangCach = ''
    form.thoiGianDi = ''
    form.trangThai = 'active'
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingRoute.value = null
}

const handleSubmit = async () => {
  try {
    if (editingRoute.value) {
      await routeService.updateRoute(editingRoute.value._id, form)
      toast.success('Route updated successfully')
    } else {
      await routeService.createRoute(form)
      toast.success('Route created successfully')
    }
    await fetchRoutes()
    closeModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed')
    console.error('Error:', error)
  }
}

const deleteRoute = async (id) => {
  if (!confirm('Are you sure you want to delete this route?')) return
  
  try {
    await routeService.deleteRoute(id)
    toast.success('Route deleted successfully')
    await fetchRoutes()
  } catch (error) {
    toast.error('Failed to delete route')
    console.error('Error:', error)
  }
}

const handleSearch = () => {
  fetchRoutes()
}

const handleFilter = () => {
  fetchRoutes()
}

onMounted(() => {
  fetchRoutes()
})
</script> 
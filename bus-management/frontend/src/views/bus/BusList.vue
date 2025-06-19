<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Buses</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all buses in the system.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openModal()"
          class="btn-primary"
        >
          Add Bus
        </button>
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
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Bus Type</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">License Plate</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="bus in buses" :key="bus._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ bus._id }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ bus.loaiXe }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ bus.bienSo }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      bus.trangThai === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ bus.trangThai }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="openModal(bus)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteBus(bus._id)"
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
              {{ editingBus ? 'Edit Bus' : 'Add New Bus' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="busType" class="label">Bus Type</label>
                  <select
                    id="busType"
                    v-model="form.loaiXe"
                    required
                    class="input"
                  >
                    <option value="">Select a type</option>
                    <option value="Sleeper">Sleeper</option>
                    <option value="Seater">Seater</option>
                    <option value="Semi-Sleeper">Semi-Sleeper</option>
                  </select>
                </div>

                <div>
                  <label for="licensePlate" class="label">License Plate</label>
                  <input
                    id="licensePlate"
                    type="text"
                    v-model="form.bienSo"
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
                    {{ editingBus ? 'Update' : 'Create' }}
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
import { busService } from '../../services/busService'

const toast = useToast()
const buses = ref([])
const isModalOpen = ref(false)
const editingBus = ref(null)
const form = reactive({
  loaiXe: '',
  bienSo: '',
  trangThai: 'active'
})

const fetchBuses = async () => {
  try {
    const data = await busService.getAllBuses()
    buses.value = data
  } catch (error) {
    toast.error('Failed to fetch buses')
    console.error('Error:', error)
  }
}

const openModal = (bus = null) => {
  if (bus) {
    editingBus.value = bus
    form.loaiXe = bus.loaiXe
    form.bienSo = bus.bienSo
    form.trangThai = bus.trangThai
  } else {
    editingBus.value = null
    form.loaiXe = ''
    form.bienSo = ''
    form.trangThai = 'active'
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingBus.value = null
}

const handleSubmit = async () => {
  try {
    if (editingBus.value) {
      await busService.updateBus(editingBus.value._id, form)
      toast.success('Bus updated successfully')
    } else {
      await busService.createBus(form)
      toast.success('Bus created successfully')
    }
    await fetchBuses()
    closeModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed')
    console.error('Error:', error)
  }
}

const deleteBus = async (id) => {
  if (!confirm('Are you sure you want to delete this bus?')) return
  
  try {
    await busService.deleteBus(id)
    toast.success('Bus deleted successfully')
    await fetchBuses()
  } catch (error) {
    toast.error('Failed to delete bus')
    console.error('Error:', error)
  }
}

onMounted(() => {
  fetchBuses()
})
</script> 
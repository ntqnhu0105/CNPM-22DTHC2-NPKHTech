<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Promotions</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all promotions and discount codes in the system.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openModal()"
          class="btn-primary"
        >
          Add Promotion
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search promotions..."
          class="input"
          @input="handleSearch"
        />
      </div>
      <div>
        <select v-model="filterStatus" class="input" @change="handleFilter">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
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
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Code</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discount</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Start Date</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">End Date</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="promotion in promotions" :key="promotion._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {{ promotion.maKhuyenMai }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ promotion.moTa }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ promotion.phanTramGiam }}%
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ new Date(promotion.ngayBatDau).toLocaleDateString() }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ new Date(promotion.ngayKetThuc).toLocaleDateString() }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      promotion.trangThai === 'active' ? 'bg-green-100 text-green-800' : 
                      promotion.trangThai === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-red-100 text-red-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ promotion.trangThai }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="openModal(promotion)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deletePromotion(promotion._id)"
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
              {{ editingPromotion ? 'Edit Promotion' : 'Add New Promotion' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="code" class="label">Promotion Code</label>
                  <input
                    id="code"
                    type="text"
                    v-model="form.maKhuyenMai"
                    required
                    class="input"
                    placeholder="Enter promotion code"
                  />
                </div>

                <div>
                  <label for="description" class="label">Description</label>
                  <textarea
                    id="description"
                    v-model="form.moTa"
                    required
                    rows="3"
                    class="input"
                    placeholder="Enter promotion description"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="discount" class="label">Discount (%)</label>
                    <input
                      id="discount"
                      type="number"
                      v-model="form.phanTramGiam"
                      required
                      min="0"
                      max="100"
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
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="startDate" class="label">Start Date</label>
                    <input
                      id="startDate"
                      type="date"
                      v-model="form.ngayBatDau"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label for="endDate" class="label">End Date</label>
                    <input
                      id="endDate"
                      type="date"
                      v-model="form.ngayKetThuc"
                      required
                      class="input"
                      :min="form.ngayBatDau"
                    />
                  </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {{ editingPromotion ? 'Update' : 'Create' }}
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
import { promotionService } from '../../services/promotionService'

const toast = useToast()
const promotions = ref([])
const isModalOpen = ref(false)
const editingPromotion = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')

const form = reactive({
  maKhuyenMai: '',
  moTa: '',
  phanTramGiam: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  trangThai: 'active'
})

const fetchPromotions = async () => {
  try {
    const data = await promotionService.getAllPromotions({
      search: searchQuery.value,
      status: filterStatus.value
    })
    promotions.value = data
  } catch (error) {
    toast.error('Failed to fetch promotions')
    console.error('Error:', error)
  }
}

const openModal = (promotion = null) => {
  if (promotion) {
    editingPromotion.value = promotion
    form.maKhuyenMai = promotion.maKhuyenMai
    form.moTa = promotion.moTa
    form.phanTramGiam = promotion.phanTramGiam
    form.ngayBatDau = new Date(promotion.ngayBatDau).toISOString().split('T')[0]
    form.ngayKetThuc = new Date(promotion.ngayKetThuc).toISOString().split('T')[0]
    form.trangThai = promotion.trangThai
  } else {
    editingPromotion.value = null
    form.maKhuyenMai = ''
    form.moTa = ''
    form.phanTramGiam = ''
    form.ngayBatDau = ''
    form.ngayKetThuc = ''
    form.trangThai = 'active'
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingPromotion.value = null
}

const handleSubmit = async () => {
  try {
    if (editingPromotion.value) {
      await promotionService.updatePromotion(editingPromotion.value._id, form)
      toast.success('Promotion updated successfully')
    } else {
      await promotionService.createPromotion(form)
      toast.success('Promotion created successfully')
    }
    await fetchPromotions()
    closeModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed')
    console.error('Error:', error)
  }
}

const deletePromotion = async (id) => {
  if (!confirm('Are you sure you want to delete this promotion?')) return
  
  try {
    await promotionService.deletePromotion(id)
    toast.success('Promotion deleted successfully')
    await fetchPromotions()
  } catch (error) {
    toast.error('Failed to delete promotion')
    console.error('Error:', error)
  }
}

const handleSearch = () => {
  fetchPromotions()
}

const handleFilter = () => {
  fetchPromotions()
}

onMounted(() => {
  fetchPromotions()
})
</script> 
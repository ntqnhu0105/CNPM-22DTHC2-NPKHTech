<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all customer reviews and ratings.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openModal()"
          class="btn-primary"
        >
          Add Review
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search reviews..."
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
        <select v-model="filterRating" class="input" @change="handleFilter">
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
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
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Route</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Comment</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="review in reviews" :key="review._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {{ review.tenKhachHang }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ review.tenTuyenXe }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="flex items-center">
                      <span class="mr-2">{{ review.soSao }}</span>
                      <div class="flex text-yellow-400">
                        <svg v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= review.soSao ? 'text-yellow-400' : 'text-gray-200'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 text-sm text-gray-500 max-w-md">
                    <div class="truncate">{{ review.noiDung }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ new Date(review.ngayDanhGia).toLocaleDateString() }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="openModal(review)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteReview(review._id)"
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
              {{ editingReview ? 'Edit Review' : 'Add New Review' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="customer" class="label">Customer</label>
                  <select
                    id="customer"
                    v-model="form.khachHangId"
                    required
                    class="input"
                  >
                    <option value="">Select Customer</option>
                    <option v-for="customer in customers" :key="customer._id" :value="customer._id">
                      {{ customer.tenKhachHang }}
                    </option>
                  </select>
                </div>

                <div>
                  <label for="route" class="label">Route</label>
                  <select
                    id="route"
                    v-model="form.tuyenXeId"
                    required
                    class="input"
                  >
                    <option value="">Select Route</option>
                    <option v-for="route in routes" :key="route._id" :value="route._id">
                      {{ route.tenTuyenXe }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="label">Rating</label>
                  <div class="flex items-center space-x-2">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      class="focus:outline-none"
                      @click="form.soSao = star"
                    >
                      <svg
                        class="h-8 w-8"
                        :class="star <= form.soSao ? 'text-yellow-400' : 'text-gray-200'"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label for="comment" class="label">Comment</label>
                  <textarea
                    id="comment"
                    v-model="form.noiDung"
                    required
                    rows="4"
                    class="input"
                    placeholder="Write your review here..."
                  ></textarea>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {{ editingReview ? 'Update' : 'Submit' }}
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
import { reviewService } from '../../services/reviewService'

const toast = useToast()
const reviews = ref([])
const routes = ref([])
const customers = ref([])
const isModalOpen = ref(false)
const editingReview = ref(null)
const searchQuery = ref('')
const filterRoute = ref('')
const filterRating = ref('')

const form = reactive({
  khachHangId: '',
  tuyenXeId: '',
  soSao: 5,
  noiDung: '',
  ngayDanhGia: new Date().toISOString()
})

const fetchReviews = async () => {
  try {
    const data = await reviewService.getAllReviews({
      search: searchQuery.value,
      route: filterRoute.value,
      rating: filterRating.value
    })
    reviews.value = data
  } catch (error) {
    toast.error('Failed to fetch reviews')
    console.error('Error:', error)
  }
}

const fetchRoutes = async () => {
  try {
    routes.value = await reviewService.getRoutes()
  } catch (error) {
    toast.error('Failed to fetch routes')
    console.error('Error:', error)
  }
}

const fetchCustomers = async () => {
  try {
    customers.value = await reviewService.getCustomers()
  } catch (error) {
    toast.error('Failed to fetch customers')
    console.error('Error:', error)
  }
}

const openModal = (review = null) => {
  if (review) {
    editingReview.value = review
    form.khachHangId = review.khachHangId
    form.tuyenXeId = review.tuyenXeId
    form.soSao = review.soSao
    form.noiDung = review.noiDung
  } else {
    editingReview.value = null
    form.khachHangId = ''
    form.tuyenXeId = ''
    form.soSao = 5
    form.noiDung = ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingReview.value = null
}

const handleSubmit = async () => {
  try {
    if (editingReview.value) {
      await reviewService.updateReview(editingReview.value._id, form)
      toast.success('Review updated successfully')
    } else {
      await reviewService.createReview(form)
      toast.success('Review submitted successfully')
    }
    await fetchReviews()
    closeModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed')
    console.error('Error:', error)
  }
}

const deleteReview = async (id) => {
  if (!confirm('Are you sure you want to delete this review?')) return
  
  try {
    await reviewService.deleteReview(id)
    toast.success('Review deleted successfully')
    await fetchReviews()
  } catch (error) {
    toast.error('Failed to delete review')
    console.error('Error:', error)
  }
}

const handleSearch = () => {
  fetchReviews()
}

const handleFilter = () => {
  fetchReviews()
}

onMounted(() => {
  fetchReviews()
  fetchRoutes()
  fetchCustomers()
})
</script> 
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="../assets/logo.png" alt="Logo" />
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                v-for="item in navigationItems"
                :key="item.name"
                :to="item.to"
                :class="[
                  $route.name === item.name
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                ]"
              >
                {{ item.text }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <!-- Profile dropdown -->
              <div class="ml-3 relative">
                <button
                  @click="isProfileOpen = !isProfileOpen"
                  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    {{ user?.username?.charAt(0).toUpperCase() }}
                  </div>
                </button>
                <!-- Dropdown menu -->
                <div
                  v-if="isProfileOpen"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                >
                  <a
                    href="#"
                    @click.prevent="logout"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isProfileOpen = ref(false)

const user = computed(() => authStore.user)

const navigationItems = computed(() => {
  const items = [
    { name: 'Home', to: '/', text: 'Home' },
    { name: 'Buses', to: '/buses', text: 'Buses' },
    { name: 'Routes', to: '/routes', text: 'Routes' },
    { name: 'Bookings', to: '/bookings', text: 'Bookings' },
    { name: 'Tickets', to: '/tickets', text: 'Tickets' },
    { name: 'Reviews', to: '/reviews', text: 'Reviews' },
    { name: 'Promotions', to: '/promotions', text: 'Promotions' },
  ]

  if (authStore.isAdmin) {
    items.push(
      { name: 'Customers', to: '/customers', text: 'Customers' },
      { name: 'Drivers', to: '/drivers', text: 'Drivers' },
      { name: 'CustomerService', to: '/customer-service', text: 'Customer Service' }
    )
  }

  return items
})

const logout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script> 
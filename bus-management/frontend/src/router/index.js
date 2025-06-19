import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'buses',
        name: 'Buses',
        component: () => import('../views/bus/BusList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'bookings',
        name: 'Bookings',
        component: () => import('../views/booking/BookingList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('../views/customer/CustomerList.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'drivers',
        name: 'Drivers',
        component: () => import('../views/driver/DriverList.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'routes',
        name: 'Routes',
        component: () => import('../views/route/RouteList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('../views/ticket/TicketList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'promotions',
        name: 'Promotions',
        component: () => import('../views/promotion/PromotionList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'reviews',
        name: 'Reviews',
        component: () => import('../views/review/ReviewList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'customer-service',
        name: 'CustomerService',
        component: () => import('../views/service/CustomerService.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/auth/Register.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router 
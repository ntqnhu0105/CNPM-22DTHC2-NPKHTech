import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ChuyenXeView from '../views/ChuyenXeView.vue';
import TuyenXeView from '../views/TuyenXeView.vue';
import XeView from '../views/XeView.vue';
import TaiXeView from '../views/TaiXeView.vue';
import NhaXeView from '../views/NhaXeView.vue';
import LoaiXeView from '../views/LoaiXeView.vue';
import SoGheSoGiuongView from '../views/SoGheSoGiuongView.vue';
import CustomerDashboard from '../views/CustomerDashboard.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/chuyenxe',
    name: 'ChuyenXe',
    component: ChuyenXeView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/tuyenxe',
    name: 'TuyenXe',
    component: TuyenXeView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/xe',
    name: 'Xe',
    component: XeView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/taixe',
    name: 'TaiXe',
    component: TaiXeView,
    meta: { requiresAuth: true, roles: ['Admin'] },
  },
  {
    path: '/nhaxe',
    name: 'NhaXe',
    component: NhaXeView,
    meta: { requiresAuth: true, roles: ['Admin'] },
  },
  {
    path: '/loaixe',
    name: 'LoaiXe',
    component: LoaiXeView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/soghe-sogiuong',
    name: 'SoGheSoGiuong',
    component: SoGheSoGiuongView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/customer/dashboard',
    name: 'CustomerDashboard',
    component: CustomerDashboard,
    meta: { requiresAuth: true, roles: ['Customer'] },
  },
  { path: '/', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  // Normalize role to lowercase for consistency
  const userRole = authStore.user?.role?.toLowerCase();
  const allowedRoles = to.meta.roles?.map(role => role.toLowerCase());

  if (to.meta.requiresAuth && allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'customer') {
      return next('/customer/dashboard');
    } else if (userRole === 'admin' || userRole === 'staff') {
      return next('/chuyenxe');
    } else {
      return next('/login');
    }
  }

  next();
});

export default router;
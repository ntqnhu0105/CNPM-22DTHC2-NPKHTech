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
import VeXeView from '../views/VeXeView.vue';
import KhachHangView from '../views/KhachHangView.vue';
import NhanVienView from '../views/NhanVienView.vue';
import KhuyenMaiView from '../views/KhuyenMaiView.vue';
import ThanhToanView from '../views/ThanhToanView.vue';
import ThongBaoView from '../views/ThongBaoView.vue';
import DanhGiaView from '../views/DanhGiaView.vue';
import CSKHView from '../views/CSKHView.vue';
import LichSuVeXeView from '../views/LichSuVeXeView.vue';
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
    path: '/vex',
    name: 'VeXe',
    component: VeXeView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/khachhang',
    name: 'KhachHang',
    component: KhachHangView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/nhanvien',
    name: 'NhanVien',
    component: NhanVienView,
    meta: { requiresAuth: true, roles: ['Admin'] },
  },
  {
    path: '/khuyenmai',
    name: 'KhuyenMai',
    component: KhuyenMaiView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/thanhtoan',
    name: 'ThanhToan',
    component: ThanhToanView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/thongbao',
    name: 'ThongBao',
    component: ThongBaoView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/danhgia',
    name: 'DanhGia',
    component: DanhGiaView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/cskh',
    name: 'CSKH',
    component: CSKHView,
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
  },
  {
    path: '/lichsuvex',
    name: 'LichSuVeXe',
    component: LichSuVeXeView,
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
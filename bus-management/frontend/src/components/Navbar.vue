```vue
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Bus Management</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li v-if="authStore.isAuthenticated && ['Admin', 'Staff'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/chuyenxe" class="nav-link">Quản lý chuyến xe</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && ['Admin', 'Staff'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/tuyenxe" class="nav-link">Quản lý tuyến xe</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && ['Admin', 'Staff'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/xe" class="nav-link">Quản lý xe</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && ['Admin'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/taixe" class="nav-link">Quản lý tài xế</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && ['Admin'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/nhaxe" class="nav-link">Quản lý nhà xe</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && ['Admin', 'Staff'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/loaixe" class="nav-link">Quản lý loại xe</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && ['Admin', 'Staff'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/soghe-sogiuong" class="nav-link">Quản lý số ghế/số giường</router-link>
          </li>
          <li v-if="authStore.isAuthenticated && ['Customer'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/customer/dashboard" class="nav-link">Dashboard</router-link>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">Đăng xuất</a>
          </li>
          <li v-else class="nav-item">
            <router-link to="/login" class="nav-link">Đăng nhập</router-link>
          </li>
          <li v-else class="nav-item">
            <router-link to="/register" class="nav-link">Đăng ký</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
```
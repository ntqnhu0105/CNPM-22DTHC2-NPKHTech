<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Đăng nhập</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="mb-3">
                <label class="form-label">Tên người dùng</label>
                <input v-model="form.username" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input v-model="form.password" type="password" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-primary" :disabled="loading">Đăng nhập</button>
              <div class="mt-3">
                <p>Chưa có tài khoản? <router-link to="/register">Đăng ký</router-link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const form = ref({ username: '', password: '' });
const loading = ref(false);

const login = async () => {
  loading.value = true;
  try {
    await authStore.login(form.value);
    const userRole = authStore.user?.role?.toLowerCase();
    if (userRole === 'customer') {
      router.push('/customer/dashboard');
    } else if (userRole === 'admin' || userRole === 'staff') {
      router.push('/chuyenxe');
    } else {
      toast.error('Vai trò người dùng không được hỗ trợ.');
      authStore.logout();
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.response?.data?.error || 'Đăng nhập thất bại');
  } finally {
    loading.value = false;
  }
};
</script>
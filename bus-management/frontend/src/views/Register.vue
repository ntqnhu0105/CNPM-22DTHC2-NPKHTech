<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Đăng ký</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="mb-3">
                <label class="form-label">Tên người dùng</label>
                <input v-model="form.username" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input v-model="form.password" type="password" class="form-control" required minlength="6" />
              </div>
              <!-- Optionally hide role selection if only Customers can register -->
              <div class="mb-3">
                <label class="form-label">Vai trò</label>
                <select v-model="form.role" class="form-control" disabled>
                  <option value="Customer">Khách hàng</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="loading">Đăng ký</button>
              <div class="mt-3">
                <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
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

const authStore = useAuthStore();
const router = useRouter();
const form = ref({
  username: '',
  password: '',
  role: 'Customer', // Default to Customer
});
const loading = ref(false);

const register = async () => {
  loading.value = true;
  try {
    await authStore.register(form.value);
    router.push('/login'); // Redirect to login after successful registration
  } catch (error) {
    // Error is handled in authStore via toast
  } finally {
    loading.value = false;
  }
};
</script>
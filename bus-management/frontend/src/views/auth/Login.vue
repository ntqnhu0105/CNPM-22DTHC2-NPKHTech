<template>
  <div class="mt-8 space-y-6">
    <form class="space-y-6" @submit.prevent="handleLogin">
      <div>
        <label for="username" class="label">Username</label>
        <div class="mt-1">
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="input"
          />
        </div>
      </div>

      <div>
        <label for="password" class="label">Password</label>
        <div class="mt-1">
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="input"
          />
        </div>
      </div>

      <div>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>

      <div v-if="error" class="text-red-600 text-sm text-center">
        {{ error }}
      </div>
    </form>

    <div class="text-sm text-center">
      <router-link
        to="/auth/register"
        class="font-medium text-primary-600 hover:text-primary-500"
      >
        Don't have an account? Sign up
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    await authStore.login(form)
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (err) {
    error.value = err.message || 'Failed to sign in'
  } finally {
    loading.value = false
  }
}
</script> 
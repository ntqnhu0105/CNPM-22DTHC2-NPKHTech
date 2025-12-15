<template>
  <div class="captcha-wrapper">
    <div class="captcha-display">
      <div v-if="image" class="captcha-svg" v-html="image"></div>
      <button type="button" class="refresh-btn" @click="fetchCaptcha">
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
      </button>
    </div>
    <div class="input-group mt-2">
      <div class="input-icon"><i class="fas fa-shield-alt"></i></div>
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text" class="form-control" placeholder="Nhập mã xác nhận..." 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'update-token']);

const image = ref('');
const loading = ref(false);

const fetchCaptcha = async () => {
  loading.value = true;
  try {
    // Dùng biến môi trường chuẩn
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const res = await axios.get(`${baseUrl}/api/captcha`);
    image.value = res.data.image;
    emit('update-token', res.data.token);
    emit('update:modelValue', '');
  } catch (e) { console.error(e); } 
  finally { loading.value = false; }
};

onMounted(fetchCaptcha);
defineExpose({ fetchCaptcha });
</script>

<style scoped>
/* Copy CSS phần .captcha-display, .refresh-btn, input từ file Login cũ vào đây */
.captcha-display { display: flex; gap: 10px; background: #f8fafc; padding: 5px; border-radius: 8px; height: 50px; border: 1px solid #e2e8f0; }
.captcha-svg { flex: 1; display: flex; justify-content: center; }
.captcha-svg :deep(svg) { height: 40px; width: 100%; }
.refresh-btn { border: none; background: white; color: #667eea; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; }
.input-group { position: relative; }
.input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; }
.form-control { width: 100%; padding: 10px 10px 10px 35px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
</style>
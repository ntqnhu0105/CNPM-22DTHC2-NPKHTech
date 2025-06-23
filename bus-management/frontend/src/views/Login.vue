<template>
  <div class="login-container">
    <!-- Animated Background Elements -->
    <div class="background-elements">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
      </div>
      <div class="particle-container">
        <div class="particle" v-for="n in 50" :key="n"></div>
      </div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Main Content -->
    <div class="login-content">
      <!-- Left Panel - Branding -->
      <div class="branding-panel">
        <div class="brand-content">
          <div class="logo-animation">
            <div class="logo-circle">
              <i class="fas fa-bus logo-icon"></i>
              <div class="logo-rings">
                <div class="ring ring-1"></div>
                <div class="ring ring-2"></div>
                <div class="ring ring-3"></div>
              </div>
            </div>
          </div>
          <h1 class="brand-title">EAST Express Ticket</h1>
          <p class="brand-subtitle">Hệ thống quản lý bến xe thông minh</p>
          <div class="feature-list">
            <div class="feature-item">
              <i class="fas fa-route"></i>
              <span>Quản lý tuyến xe</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-ticket-alt"></i>
              <span>Đặt vé trực tuyến</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-chart-line"></i>
              <span>Báo cáo thống kê</span>
            </div>
          </div>
        </div>
        <div class="decoration-elements">
          <div class="decoration-line"></div>
          <div class="decoration-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Right Panel - Login Form -->
      <div class="login-panel">
        <div class="login-card" ref="cardRef">
          <div class="card-header">
            <div class="header-decoration">
              <div class="header-circle"></div>
              <div class="header-line"></div>
            </div>
            <h2 class="login-title">Chào mừng trở lại</h2>
          </div>
          
          <form @submit.prevent="login" class="login-form">
            <div class="form-group">
              <div class="input-wrapper">
                <div class="input-icon-container">
                  <i class="fas fa-user input-icon"></i>
                </div>
                <input 
                  v-model="form.username" 
                  type="text" 
                  class="form-input" 
                  placeholder="Tên người dùng"
                  required 
                />
                <div class="input-focus-border"></div>
              </div>
            </div>
            
            <div class="form-group">
              <div class="input-wrapper">
                <div class="input-icon-container">
                  <i class="fas fa-lock input-icon"></i>
                </div>
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input" 
                  placeholder="Mật khẩu"
                  required 
                />
                <div class="input-focus-border"></div>
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="togglePassword"
                  :title="showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            
            <!-- Captcha group start -->
            <div class="form-group captcha-group">
              <canvas ref="captchaCanvas" width="130" height="32" class="captcha-canvas"></canvas>
              <button type="button" class="refresh-captcha" @click="generateCaptcha" title="Tải lại captcha">
                <i class="fas fa-sync-alt"></i>
              </button>
              <input
                v-model="form.captchaInput"
                type="text"
                class="form-input captcha-input"
                placeholder="Nhập mã xác nhận..."
                required
                autocomplete="off"
              />
            </div>
            <!-- Captcha group end -->
            
            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" class="checkbox-input">
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" class="forgot-password">Quên mật khẩu?</a>
            </div>
            
            <button 
              type="submit" 
              class="login-button" 
              :disabled="loading"
              :class="{ 'loading': loading }"
            >
              <span class="button-content">
                <span v-if="!loading">Đăng nhập</span>
                <span v-else class="loading-text">Đang xử lý...</span>
              </span>
              <div class="button-background"></div>
              <div class="button-particles">
                <span></span><span></span><span></span>
              </div>
            </button>
            </form>
          
          <div class="login-divider">
            <span class="divider-text">hoặc</span>
          </div>
          
          <div class="social-login">
            <button class="social-button google">
              <i class="fab fa-google"></i>
            </button>
            <button class="social-button facebook">
              <i class="fab fa-facebook-f"></i>
            </button>
          </div>
          
          <div class="login-footer">
            <p class="register-link">
              Chưa có tài khoản? 
              <router-link to="/register" class="link-text">
                Đăng ký
                <i class="fas fa-arrow-right"></i>
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const captchaText = ref('');
const captchaCanvas = ref(null);
const form = ref({ username: '', password: '', captchaInput: '' });
const loading = ref(false);
const showPassword = ref(false);
const cardRef = ref(null);

const triggerShake = () => {
  if (cardRef.value) {
    cardRef.value.classList.remove('shake');
    void cardRef.value.offsetWidth;
    cardRef.value.classList.add('shake');
  }
};

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let text = '';
  for (let i = 0; i < 5; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaText.value = text;

  const canvas = captchaCanvas.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f3f3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < text.length; i++) {
      ctx.font = `${24 + Math.random() * 8}px Arial`;
      ctx.fillStyle = `rgb(${50 + Math.random()*150},${50 + Math.random()*150},${50 + Math.random()*150})`;
      ctx.save();
      ctx.translate(20 + i*18, 28 + Math.random()*4);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${Math.random()*0.3})`;
      ctx.beginPath();
      ctx.moveTo(Math.random()*canvas.width, Math.random()*canvas.height);
      ctx.lineTo(Math.random()*canvas.width, Math.random()*canvas.height);
      ctx.stroke();
    }
  }
};

onMounted(() => {
  generateCaptcha();
});

const login = async () => {
  if (form.value.captchaInput.trim().toUpperCase() !== captchaText.value) {
    toast.error('Mã xác minh không đúng!');
    generateCaptcha();
    form.value.captchaInput = '';
    triggerShake();
    return;
  }
  loading.value = true;
  try {
    // Only send username and password
    await authStore.login({
      username: form.value.username,
      password: form.value.password,
    });
    const userRole = authStore.user?.role?.toLowerCase();
    if (userRole === 'customer') {
      router.push('/customer/dashboard');
    } else if (userRole === 'admin' || userRole === 'staff') {
      router.push('/chuyenxe');
    } else {
      toast.error('Vai trò người dùng không được hỗ trợ.');
      authStore.logout();
      triggerShake();
    }
  } catch (error) {
    console.error('Login error:', error.response?.data);
    const errorMsg = error.response?.data?.error;
    if (errorMsg === 'Tên người dùng không tồn tại') {
      toast.error('Tên người dùng không tồn tại!');
    } else if (errorMsg === 'Mật khẩu không đúng') {
      toast.error('Mật khẩu không đúng!');
    } else {
      toast.error(errorMsg || 'Đăng nhập thất bại!');
    }
    triggerShake();
  } finally {
    loading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;
}

/* Background Elements */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  right: 10%;
  animation-delay: 1s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 50%;
  left: 5%;
  animation-delay: 3s;
}

.shape-6 {
  width: 70px;
  height: 70px;
  top: 30%;
  right: 5%;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.particle-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float 8s linear infinite;
}

.particle:nth-child(odd) {
  animation-duration: 6s;
}

.particle:nth-child(3n) {
  animation-duration: 10s;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px);
    opacity: 0;
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

/* Main Content */
.login-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 600px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

/* Branding Panel */
.branding-panel {
  flex: 1;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.branding-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.brand-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.logo-animation {
  margin-bottom: 30px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  animation: logo-pulse 3s ease-in-out infinite;
}

.logo-icon {
  font-size: 32px;
  color: white;
  z-index: 2;
}

.logo-rings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: ring-expand 3s ease-in-out infinite;
}

.ring-1 {
  top: -10px;
  left: -10px;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  animation-delay: 0s;
}

.ring-2 {
  top: -20px;
  left: -20px;
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  animation-delay: 1s;
}

.ring-3 {
  top: -30px;
  left: -30px;
  width: calc(100% + 60px);
  height: calc(100% + 60px);
  animation-delay: 2s;
}

@keyframes logo-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes ring-expand {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.brand-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: white;
  font-size: 14px;
}

.feature-item i {
  width: 25px;
  margin-right: 12px;
  font-size: 16px;
}

.decoration-elements {
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
}

.decoration-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  margin-bottom: 20px;
}

.decoration-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.decoration-dots span {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: dot-pulse 2s ease-in-out infinite;
}

.decoration-dots span:nth-child(2) {
  animation-delay: 0.5s;
}

.decoration-dots span:nth-child(3) {
  animation-delay: 1s;
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}

/* Login Panel */
.login-panel {
  flex: 1;
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 0;
  margin-bottom: 32px;
}

.card-header {
  text-align: center;
  margin-bottom: 28px;
  position: relative;
}

.header-decoration {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.header-circle {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: #718096;
  font-size: 14px;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.input-wrapper {
  position: relative;
}

.input-icon-container {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.input-icon {
  color: #a0aec0;
  font-size: 16px;
  transition: color 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 10px 10px 10px 38px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  outline: none;
  position: relative;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background: white;
}

.form-input:focus + .input-focus-border {
  opacity: 1;
  transform: scaleX(1);
}

.form-input:focus ~ .input-icon-container .input-icon {
  color: #667eea;
}

.input-focus-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: all 0.3s ease;
  opacity: 0;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
}

.password-toggle:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.password-toggle:focus {
  outline: none;
  color: #667eea;
  background: rgba(102, 126, 234, 0.15);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.password-toggle i {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.password-toggle:hover i {
  transform: scale(1.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 13px;
  color: #718096;
}

.forgot-password {
  font-size: 13px;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #764ba2;
}

.login-button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content {
  position: relative;
  z-index: 2;
}

.button-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #764ba2, #667eea);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.login-button:hover .button-background {
  opacity: 1;
}

.button-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.button-particles span {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: button-particle 2s linear infinite;
}

.button-particles span:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.button-particles span:nth-child(2) {
  top: 60%;
  right: 20%;
  animation-delay: 0.5s;
}

.button-particles span:nth-child(3) {
  bottom: 20%;
  left: 50%;
  animation-delay: 1s;
}

@keyframes button-particle {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

.login-divider {
  text-align: center;
  margin: 14px 0;
  position: relative;
}

.login-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.divider-text {
  background: white;
  padding: 0 20px;
  color: #718096;
  font-size: 14px;
}

.social-login {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.social-button {
  flex: 1;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #8d4bc4;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.social-button:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
}

.social-button.google:hover {
  border-color: #ea4335;
  color: #ea4335;
}

.social-button.facebook:hover {
  border-color: #1877f2;
  color: #1877f2;
}

.login-footer {
  text-align: center;
}

.register-link {
  color: #718096;
  font-size: 13px;
  margin: 0;
}

.link-text {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.link-text:hover {
  color: #764ba2;
  transform: translateX(2px);
}

.link-text i {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.link-text:hover i {
  transform: translateX(2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-content {
    flex-direction: column;
    height: auto;
    max-width: 450px;
  }
  
  .branding-panel {
    padding: 30px 25px;
  }
  
  .login-panel {
    padding: 30px 25px;
  }
}

@media (max-width: 768px) {
  .login-content {
    margin: 20px;
    border-radius: 15px;
  }
  
  .brand-title {
    font-size: 28px;
  }
  
  .login-title {
    font-size: 22px;
  }
  
  .social-login {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .login-content {
    margin: 15px;
  }
  
  .branding-panel,
  .login-panel {
    padding: 25px 20px;
  }
  
  .brand-title {
    font-size: 24px;
  }
  
  .logo-circle {
    width: 60px;
    height: 60px;
  }
  
  .logo-icon {
    font-size: 24px;
  }
}

.captcha-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: nowrap;
}
.captcha-canvas {
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #f3f3f3;
  box-shadow: 0 2px 8px rgba(102,126,234,0.08);
  width: 130px;
  height: 32px;
}
.captcha-input {
  width: 205px;
  min-width: 0;
  flex: none;
  margin-top: 0 !important;
  padding-left: 8px;
  font-size: 13px;
}
.refresh-captcha {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 18px;
  margin-left: 0;
  transition: color 0.2s;
}
.refresh-captcha:hover {
  color: #764ba2;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
.shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
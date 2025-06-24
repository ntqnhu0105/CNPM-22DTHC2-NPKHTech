<template>
  <div class="register-container">
    <!-- Animated Background Elements -->
    <div class="background-elements">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
        <div class="shape shape-7"></div>
        <div class="shape shape-8"></div>
      </div>
      <div class="particle-container">
        <div class="particle" v-for="n in 60" :key="n"></div>
      </div>
      <div class="gradient-overlay"></div>
      <div class="geometric-patterns">
        <div class="pattern pattern-1"></div>
        <div class="pattern pattern-2"></div>
        <div class="pattern pattern-3"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="register-content">
      <!-- Left Panel - Features -->
      <div class="features-panel">
        <div class="features-content">
          <div class="logo-animation">
            <div class="logo-circle">
              <i class="fas fa-user-plus logo-icon"></i>
              <div class="logo-rings">
                <div class="ring ring-1"></div>
                <div class="ring ring-2"></div>
                <div class="ring ring-3"></div>
              </div>
            </div>
          </div>
          <h1 class="brand-title">Tham gia EET</h1>
          <p class="brand-subtitle">Tạo tài khoản để trải nghiệm dịch vụ tốt nhất</p> 
          
          <div class="benefits-section">
            <h3 class="benefits-title">Lợi ích khi đăng ký</h3>
            <div class="benefits-list">
              <div class="benefit-item">
                <div class="benefit-icon">
                  <i class="fas fa-gift"></i>
                </div>
                <div class="benefit-content">
                  <h4>Ưu đãi đặc biệt</h4>
                  <p>Nhận các ưu đãi và khuyến mãi độc quyền</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <i class="fas fa-history"></i>
                </div>
                <div class="benefit-content">
                  <h4>Lịch sử đặt vé</h4>
                  <p>Theo dõi và quản lý lịch sử đặt vé của bạn</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">
                  <i class="fas fa-bell"></i>
                </div>
                <div class="benefit-content">
                  <h4>Thông báo thông minh</h4>
                  <p>Nhận thông báo về chuyến xe và cập nhật</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="decoration-elements">
          <div class="decoration-line"></div>
          <div class="decoration-dots">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Right Panel - Register Form -->
      <div class="register-panel">
        <div class="register-card">
          <div class="card-header">
            <div class="header-decoration">
              <div class="header-line"></div>
              <div class="header-circle"></div>
            </div>
            <h2 class="register-title">Tạo tài khoản mới</h2>
          </div>
          
          <form @submit.prevent="register" class="register-form">
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
                <div class="input-validation">
                  <i class="fas fa-check validation-icon"></i>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <div class="input-wrapper password-wrapper">
                <div class="input-icon-container">
                  <i class="fas fa-lock input-icon"></i>
                </div>
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input" 
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                  required 
                  minlength="6" 
                />
                <div class="input-focus-border"></div>
                <div class="input-validation">
                  <i class="fas fa-check validation-icon"></i>
                </div>
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="togglePassword"
                  :title="showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <div class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-fill" :style="{ width: passwordStrength + '%' }"></div>
                  </div>
                  <span class="strength-text">{{ strengthText }}</span>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <div class="input-wrapper">
                <div class="input-icon-container">
                  <i class="fas fa-users input-icon"></i>
                </div>
                <select v-model="form.role" class="form-input" disabled>
                  <option value="Customer">Khách hàng</option>
                </select>
                <div class="input-focus-border"></div>
              </div>
              <small class="form-help">
                <i class="fas fa-info-circle"></i>
                Hiện tại chỉ hỗ trợ đăng ký tài khoản khách hàng
              </small>
            </div>
            
            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="agreeToTerms" class="checkbox-input" required>
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">
                  Tôi đồng ý với 
                  <a href="#" class="terms-link">Điều khoản sử dụng</a> 
                  và 
                  <a href="#" class="terms-link">Chính sách bảo mật</a>
                </span>
              </label>
            </div>
            
            <button 
              type="button" 
              class="register-button" 
              :disabled="!agreeToTerms || loading"
              :class="{ 'loading': loading }"
              @click="showCustomerInfoModal"
            >
              <span class="button-content">
                <span v-if="!loading">Tiếp tục đăng ký</span>
                <span v-else class="loading-text">Đang tạo tài khoản...</span>
              </span>
              <div class="button-background"></div>
              <div class="button-particles">
                <span></span><span></span><span></span><span></span>
              </div>
            </button>
            </form>
          
          <div class="register-footer">
            <p class="login-link">
              Đã có tài khoản? 
              <router-link to="/login" class="link-text">
                Đăng nhập
                <i class="fas fa-arrow-right"></i>
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Info Modal -->
    <div class="modal fade" id="customerInfoModal" tabindex="-1" aria-labelledby="customerInfoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="customerInfoModalLabel">
              <i class="fas fa-user-plus me-2"></i>
              Thông tin khách hàng
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted mb-4">
              <i class="fas fa-info-circle me-2"></i>
              Vui lòng cung cấp thông tin cá nhân để hoàn tất đăng ký tài khoản
            </p>
            
            <form @submit.prevent="register" class="customer-info-form">
              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-id-card me-2"></i>CCCD <span class="text-danger">*</span>
                </label>
                <input 
                  v-model="form.cccd" 
                  type="text" 
                  class="form-control" 
                  placeholder="Nhập CCCD (12 số)"
                  required 
                  maxlength="12"
                  pattern="[0-9]{12}"
                />
                <div class="form-text">CCCD phải có đúng 12 chữ số</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-envelope me-2"></i>Email <span class="text-danger">*</span>
                </label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  class="form-control" 
                  placeholder="Nhập email của bạn"
                  required 
                />
              </div>
              
              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-user me-2"></i>Họ và tên <span class="text-danger">*</span>
                </label>
                <input 
                  v-model="form.hoVaTen" 
                  type="text" 
                  class="form-control" 
                  placeholder="Nhập họ và tên đầy đủ"
                  required 
                  maxlength="50"
                />
              </div>
              
              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-phone me-2"></i>Số điện thoại <span class="text-danger">*</span>
                </label>
                <input 
                  v-model="form.sdt" 
                  type="text" 
                  class="form-control" 
                  placeholder="Nhập số điện thoại (10-11 số)"
                  required 
                  maxlength="11"
                  pattern="[0-9]{10,11}"
                />
                <div class="form-text">Số điện thoại phải có 10 hoặc 11 chữ số</div>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="fas fa-times me-2"></i>Hủy
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="loading"
                >
                  <i class="fas fa-check me-2"></i>
                  <span v-if="!loading">Hoàn tất đăng ký</span>
                  <span v-else>Đang xử lý...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';

const authStore = useAuthStore();
const router = useRouter();
const form = ref({
  username: '',
  password: '',
  role: 'Customer',
  cccd: '',
  email: '',
  hoVaTen: '',
  sdt: '',
});
const loading = ref(false);
const showPassword = ref(false);
const agreeToTerms = ref(false);

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.value.password;
  if (!password) return 0;
  
  let strength = 0;
  if (password.length >= 6) strength += 25;
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;
  
  return Math.min(strength, 100);
});

const strengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 25) return 'Yếu';
  if (strength < 50) return 'Trung bình';
  if (strength < 75) return 'Khá';
  return 'Mạnh';
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const showCustomerInfoModal = () => {
  if (!agreeToTerms.value) {
    return;
  }
  
  // Validate basic form fields
  if (!form.value.username || !form.value.password) {
    alert('Vui lòng điền đầy đủ tên người dùng và mật khẩu');
    return;
  }
  
  const modal = new Modal(document.getElementById('customerInfoModal'));
  modal.show();
};

const register = async () => {
  // Validate customer info
  if (!form.value.cccd || !form.value.email || !form.value.hoVaTen || !form.value.sdt) {
    alert('Vui lòng điền đầy đủ thông tin khách hàng');
    return;
  }
  
  loading.value = true;
  try {
    await authStore.register(form.value);
    
    // Close modal
    const modal = Modal.getInstance(document.getElementById('customerInfoModal'));
    modal.hide();
    
    router.push('/login');
  } catch (error) {
    // Error is handled in authStore via toast
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 70%, #f5576c 100%);
  position: relative;
  overflow: hidden;
}

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
  animation: float 8s ease-in-out infinite;
}

.shape-1 { width: 60px; height: 60px; top: 5%; left: 5%; animation-delay: 0s; }
.shape-2 { width: 100px; height: 100px; top: 15%; right: 10%; animation-delay: 2s; }
.shape-3 { width: 80px; height: 80px; bottom: 15%; left: 15%; animation-delay: 4s; }
.shape-4 { width: 120px; height: 120px; bottom: 5%; right: 5%; animation-delay: 1s; }
.shape-5 { width: 50px; height: 50px; top: 40%; left: 3%; animation-delay: 3s; }
.shape-6 { width: 90px; height: 90px; top: 25%; right: 3%; animation-delay: 5s; }
.shape-7 { width: 70px; height: 70px; bottom: 30%; left: 8%; animation-delay: 6s; }
.shape-8 { width: 110px; height: 110px; top: 60%; right: 8%; animation-delay: 7s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  33% { transform: translateY(-15px) rotate(120deg) scale(1.1); }
  66% { transform: translateY(-10px) rotate(240deg) scale(0.9); }
}

.particle-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: particle-float 10s linear infinite;
}

.particle:nth-child(odd) { animation-duration: 8s; }
.particle:nth-child(3n) { animation-duration: 12s; }
.particle:nth-child(5n) { animation-duration: 6s; }

@keyframes particle-float {
  0% { transform: translateY(100vh) translateX(0) scale(0); opacity: 0; }
  10% { opacity: 1; transform: scale(1); }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) translateX(200px) scale(0); opacity: 0; }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%);
}

.geometric-patterns {
  position: absolute;
  width: 100%;
  height: 100%;
}

.pattern {
  position: absolute;
  opacity: 0.1;
  animation: pattern-rotate 20s linear infinite;
}

.pattern-1 {
  top: 10%;
  right: 10%;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation-delay: 0s;
}

.pattern-2 {
  bottom: 20%;
  left: 10%;
  width: 80px;
  height: 80px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transform: rotate(45deg);
  animation-delay: 5s;
}

.pattern-3 {
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation-delay: 10s;
}

@keyframes pattern-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.register-content {
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

.features-panel {
  flex: 1;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.features-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="30" cy="80" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.features-content {
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
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
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

.benefits-section {
  text-align: left;
  margin-top: 30px;
}

.benefits-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
  text-align: center;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.benefit-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(3px);
}

.benefit-icon {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-icon i {
  color: white;
  font-size: 16px;
}

.benefit-content h4 {
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 3px;
}

.benefit-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin: 0;
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

.decoration-dots span:nth-child(2) { animation-delay: 0.5s; }
.decoration-dots span:nth-child(3) { animation-delay: 1s; }
.decoration-dots span:nth-child(4) { animation-delay: 1.5s; }

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}

.register-panel {
  flex: 1;
  padding: 40px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
}

.register-card {
  width: 100%;
  max-width: 380px;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
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
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.header-circle {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  color: #718096;
  font-size: 14px;
}

.register-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.password-wrapper {
  margin-bottom: 30px;
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
  padding: 14px 90px 14px 45px;
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

.form-input:valid ~ .input-validation {
  opacity: 1;
  transform: translateY(-50%) scale(1);
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

.input-validation {
  position: absolute;
  right: 55px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  z-index: 3;
}

.validation-icon {
  color: #48bb78;
  font-size: 14px;
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
  z-index: 3;
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

.password-strength {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1;
}

.strength-bar {
  flex: 1;
  height: 3px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  background: linear-gradient(90deg, #f56565, #ed8936, #48bb78);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.strength-text {
  font-size: 11px;
  color: #718096;
  min-width: 35px;
  font-weight: 500;
}

.form-help {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  font-size: 12px;
  color: #a0aec0;
  font-style: italic;
}

.form-help i {
  font-size: 10px;
}

.form-options {
  margin-bottom: 25px;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
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
  margin-top: 2px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
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
  line-height: 1.3;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.register-button {
  width: 100%;
  padding: 14px;
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

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:disabled {
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

.register-button:hover .button-background {
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

.button-particles span:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
.button-particles span:nth-child(2) { top: 60%; right: 20%; animation-delay: 0.5s; }
.button-particles span:nth-child(3) { bottom: 20%; left: 50%; animation-delay: 1s; }
.button-particles span:nth-child(4) { top: 40%; right: 50%; animation-delay: 1.5s; }

@keyframes button-particle {
  0% { transform: translateY(0) scale(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(-100px) scale(1); opacity: 0; }
}

.register-footer {
  text-align: center;
}

.login-link {
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

@media (max-width: 1200px) {
  .register-content {
    flex-direction: column;
    height: auto;
    max-width: 550px;
  }
  
  .features-panel,
  .register-panel {
    padding: 30px 25px;
  }
}

@media (max-width: 768px) {
  .register-content {
    margin: 20px;
    border-radius: 15px;
  }
  
  .brand-title {
    font-size: 28px;
  }
  
  .register-title {
    font-size: 22px;
  }
  
  .benefits-list {
    gap: 12px;
  }
  
  .benefit-item {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .register-content {
    margin: 15px;
  }
  
  .features-panel,
  .register-panel {
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
  
  .benefit-item {
    flex-direction: column;
    text-align: center;
  }
  
  .benefit-icon {
    align-self: center;
  }
}

@media (max-width: 768px) {
  .modal-dialog {
    margin-top: 6vh !important;
  }
}

/* Customer Info Modal Styles */
#customerInfoModal .modal-content {
  border-radius: 1.2rem;
  border: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

#customerInfoModal .modal-header {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.2rem 1.2rem 0 0;
  padding: 1.5rem;
}

#customerInfoModal .modal-title {
  color: #fff;
  font-weight: 700;
  font-size: 1.3rem;
}

#customerInfoModal .btn-close {
  filter: invert(1);
  opacity: 0.8;
}

#customerInfoModal .modal-body {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
}

#customerInfoModal .form-label {
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

#customerInfoModal .form-control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.8rem;
  color: #fff;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

#customerInfoModal .form-control:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  color: #fff;
}

#customerInfoModal .form-control::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

#customerInfoModal .form-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

#customerInfoModal .modal-footer {
  background: rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0 0 1.2rem 1.2rem;
  padding: 1.5rem;
}

#customerInfoModal .btn {
  border-radius: 0.8rem;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

#customerInfoModal .btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
}

#customerInfoModal .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

#customerInfoModal .btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: #fff;
}

#customerInfoModal .btn-primary:hover {
  background: linear-gradient(45deg, #5a6fd8, #6a4190);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

#customerInfoModal .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  #customerInfoModal .modal-dialog {
    margin: 1rem;
  }
  
  #customerInfoModal .modal-body {
    padding: 1.5rem;
  }
  
  #customerInfoModal .modal-footer {
    padding: 1rem 1.5rem;
  }
}
</style>
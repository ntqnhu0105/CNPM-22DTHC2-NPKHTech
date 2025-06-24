<template>
  <nav class="modern-navbar">
    <!-- Animated background waves -->
    <div class="wave-container">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>
    
    <!-- Floating particles -->
    <div class="particles">
      <div class="particle" v-for="i in 6" :key="i" :style="{ animationDelay: `${i * 0.5}s` }"></div>
    </div>
    
    <div class="navbar-container">
      <!-- Logo/Brand section -->
      <div class="brand-section">
        <router-link to="/" class="brand-link">
          <div class="brand-icon">
            <i class="fas fa-bus"></i>
          </div>
          <span class="brand-text">EAST Express Ticket</span>
        </router-link>
      </div>
      
      <!-- Navigation menu with dropdowns -->
      <div class="nav-menu" :class="{ 'nav-open': isMenuOpen }">
        <div class="nav-items">
          <!-- Quản lý chuyến xe Dropdown -->
          <div v-if="authStore.isAuthenticated && ['Admin', 'Staff'].includes(authStore.user.role)"
               class="nav-dropdown"
               @mouseenter="openDropdown('chuyenxe')"
               @mouseleave="closeDropdown('chuyenxe')">
            <button class="dropdown-toggle">
              <i class="fas fa-route"></i>
              <span>Chuyến xe</span>
              <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            <div class="dropdown-menu" :class="{ 'show': activeDropdown === 'chuyenxe' }"
                 @mouseenter="openDropdown('chuyenxe')"
                 @mouseleave="closeDropdown('chuyenxe')">
              <router-link to="/chuyenxe" class="dropdown-item">
                <i class="fas fa-route"></i>
                <span>Quản lý chuyến xe</span>
              </router-link>
              <router-link to="/tuyenxe" class="dropdown-item">
                <i class="fas fa-map-marked-alt"></i>
                <span>Quản lý tuyến xe</span>
              </router-link>
              <router-link to="/xe" class="dropdown-item">
                <i class="fas fa-car"></i>
                <span>Quản lý xe</span>
              </router-link>
              <router-link to="/vex" class="dropdown-item">
                <i class="fas fa-ticket-alt"></i>
                <span>Quản lý vé xe</span>
              </router-link>
            </div>
          </div>
          
          <!-- Quản lý nhân sự Dropdown -->
          <div v-if="authStore.isAuthenticated && ['Admin'].includes(authStore.user.role)"
               class="nav-dropdown"
               @mouseenter="openDropdown('nhansu')"
               @mouseleave="closeDropdown('nhansu')">
            <button class="dropdown-toggle">
              <i class="fas fa-users"></i>
              <span>Nhân sự</span>
              <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            <div class="dropdown-menu" :class="{ 'show': activeDropdown === 'nhansu' }"
                 @mouseenter="openDropdown('nhansu')"
                 @mouseleave="closeDropdown('nhansu')">
              <router-link to="/taixe" class="dropdown-item">
                <i class="fas fa-user-tie"></i>
                <span>Quản lý tài xế</span>
              </router-link>
              <router-link to="/nhanvien" class="dropdown-item">
                <i class="fas fa-users"></i>
                <span>Quản lý nhân viên</span>
              </router-link>
              <router-link to="/khachhang" class="dropdown-item">
                <i class="fas fa-user-friends"></i>
                <span>Quản lý khách hàng</span>
              </router-link>
            </div>
          </div>
          
          <!-- Quản lý hệ thống Dropdown -->
          <div v-if="authStore.isAuthenticated && ['Admin'].includes(authStore.user.role)"
               class="nav-dropdown"
               @mouseenter="openDropdown('hethong')"
               @mouseleave="closeDropdown('hethong')">
            <button class="dropdown-toggle">
              <i class="fas fa-cogs"></i>
              <span>Hệ thống</span>
              <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            <div class="dropdown-menu" :class="{ 'show': activeDropdown === 'hethong' }"
                 @mouseenter="openDropdown('hethong')"
                 @mouseleave="closeDropdown('hethong')">
              <router-link to="/nhaxe" class="dropdown-item">
                <i class="fas fa-building"></i>
                <span>Quản lý nhà xe</span>
              </router-link>
              <router-link to="/loaixe" class="dropdown-item">
                <i class="fas fa-tags"></i>
                <span>Quản lý loại xe</span>
              </router-link>
              <router-link to="/soghe-sogiuong" class="dropdown-item">
                <i class="fas fa-chair"></i>
                <span>Quản lý ghế/giường</span>
              </router-link>
            </div>
          </div>
          
          <!-- Quản lý kinh doanh Dropdown -->
          <div v-if="authStore.isAuthenticated && ['Admin', 'Staff'].includes(authStore.user.role)"
               class="nav-dropdown"
               @mouseenter="openDropdown('kinhdoanh')"
               @mouseleave="closeDropdown('kinhdoanh')">
            <button class="dropdown-toggle">
              <i class="fas fa-chart-line"></i>
              <span>Kinh doanh</span>
              <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            <div class="dropdown-menu" :class="{ 'show': activeDropdown === 'kinhdoanh' }"
                 @mouseenter="openDropdown('kinhdoanh')"
                 @mouseleave="closeDropdown('kinhdoanh')">
              <router-link to="/khuyenmai" class="dropdown-item">
                <i class="fas fa-gift"></i>
                <span>Quản lý khuyến mãi</span>
              </router-link>
              <router-link to="/thanhtoan" class="dropdown-item">
                <i class="fas fa-credit-card"></i>
                <span>Quản lý thanh toán</span>
              </router-link>
              <router-link to="/danhgia" class="dropdown-item">
                <i class="fas fa-star"></i>
                <span>Quản lý đánh giá</span>
              </router-link>
            </div>
          </div>
          
          <!-- Quản lý dịch vụ Dropdown -->
          <div v-if="authStore.isAuthenticated && ['Admin', 'Staff'].includes(authStore.user.role)"
               class="nav-dropdown"
               @mouseenter="openDropdown('dichvu')"
               @mouseleave="closeDropdown('dichvu')">
            <button class="dropdown-toggle">
              <i class="fas fa-concierge-bell"></i>
              <span>Dịch vụ</span>
              <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            <div class="dropdown-menu" :class="{ 'show': activeDropdown === 'dichvu' }"
                 @mouseenter="openDropdown('dichvu')"
                 @mouseleave="closeDropdown('dichvu')">
              <router-link to="/thongbao" class="dropdown-item">
                <i class="fas fa-bell"></i>
                <span>Quản lý thông báo</span>
              </router-link>
              <router-link to="/cskh" class="dropdown-item">
                <i class="fas fa-headset"></i>
                <span>Chăm sóc khách hàng</span>
              </router-link>
              <!-- <router-link to="/lichsuvex" class="dropdown-item">
                <i class="fas fa-history"></i>
                <span>Lịch sử vé xe</span>
              </router-link> -->
            </div>
          </div>
          
          <!-- Customer Dashboard -->
          <div v-if="authStore.isAuthenticated && ['Customer'].includes(authStore.user.role)" class="nav-item">
            <router-link to="/customer/dashboard" class="nav-link">
              <i class="fas fa-tachometer-alt"></i>
              <span>Tổng quan thông tin</span>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- User actions -->
      <div class="user-actions">
        <div v-if="authStore.isAuthenticated" class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="user-details">
            <span class="user-name">{{ authStore.user.name || 'User' }}</span>
            <span class="user-role">{{ authStore.user.role }}</span>
          </div>
          <button class="logout-btn" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
        <div v-else class="auth-buttons">
          <router-link to="/login" class="auth-btn login-btn">
            <i class="fas fa-sign-in-alt"></i>
            <span>Đăng nhập</span>
          </router-link>
          <router-link to="/register" class="auth-btn register-btn">
            <i class="fas fa-user-plus"></i>
            <span>Đăng ký</span>
          </router-link>
        </div>
      </div>
      
      <!-- Mobile menu toggle -->
      <button class="menu-toggle" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);
const activeDropdown = ref(null);
const dropdownTimeout = ref(null);

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const openDropdown = (dropdownName) => {
  if (dropdownTimeout.value) {
    clearTimeout(dropdownTimeout.value);
    dropdownTimeout.value = null;
  }
  activeDropdown.value = dropdownName;
};

const closeDropdown = (dropdownName) => {
  if (dropdownTimeout.value) {
    clearTimeout(dropdownTimeout.value);
  }
  dropdownTimeout.value = setTimeout(() => {
    if (activeDropdown.value === dropdownName) {
      activeDropdown.value = null;
    }
    dropdownTimeout.value = null;
  }, 250);
};
</script>

<style scoped>
.modern-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: visible;
}

/* Wave animations */
.wave-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(60deg, rgba(59, 130, 246, 0.35), rgba(139, 92, 246, 0.32), rgba(255,255,255,0.12));
  border-radius: 50% 50% 0 0;
  animation: wave 8s ease-in-out infinite;
  transform-origin: center bottom;
  filter: blur(0.5px) brightness(1.2);
}

.wave-1 {
  animation-delay: 0s;
  opacity: 0.7;
}

.wave-2 {
  animation-delay: 2s;
  opacity: 0.5;
  animation-duration: 10s;
}

.wave-3 {
  animation-delay: 4s;
  opacity: 0.35;
  animation-duration: 12s;
}

@keyframes wave {
  0%, 100% {
    transform: translateX(-50%) translateY(0) rotate(0deg);
  }
  25% {
    transform: translateX(-50%) translateY(-10px) rotate(2deg);
  }
  50% {
    transform: translateX(-50%) translateY(0) rotate(0deg);
  }
  75% {
    transform: translateX(-50%) translateY(-5px) rotate(-1deg);
  }
}

/* Floating particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(59, 130, 246, 0.8);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 1s; }
.particle:nth-child(3) { left: 30%; animation-delay: 2s; }
.particle:nth-child(4) { left: 70%; animation-delay: 3s; }
.particle:nth-child(5) { left: 80%; animation-delay: 4s; }
.particle:nth-child(6) { left: 90%; animation-delay: 5s; }

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 70px;
  position: relative;
  z-index: 1;
}

/* Brand section */
.brand-section {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.brand-link:hover {
  transform: translateY(-2px);
  color: #60a5fa;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
}

.brand-link:hover .brand-icon {
  transform: rotate(5deg) scale(1.1);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.brand-icon i {
  font-size: 1.2rem;
  color: #ffffff;
}

.brand-text {
  background: linear-gradient(135deg, #ffffff, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

/* Navigation menu */
.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 2rem;
}

.nav-items {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Dropdown styles */
.nav-dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}

.dropdown-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.dropdown-toggle i:first-child {
  font-size: 1rem;
  color: #60a5fa;
}

.dropdown-arrow {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
  margin-left: 0.25rem;
}

.nav-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  min-width: 200px;
  z-index: 3000;
  margin-top: 0.5rem;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateX(5px);
}

.dropdown-item i {
  font-size: 1rem;
  color: #60a5fa;
  width: 20px;
  text-align: center;
}

.dropdown-item:hover i {
  color: #ffffff;
}

.dropdown-item span {
  font-weight: 500;
  font-size: 0.9rem;
}

/* Regular nav item */
.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-weight: 600;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.nav-link i {
  font-size: 1rem;
  color: #60a5fa;
}

.nav-link:hover i {
  color: #ffffff;
}

/* User actions */
.user-actions {
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.user-avatar i {
  font-size: 1.2rem;
  color: #ffffff;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-role {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  text-transform: capitalize;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  border-radius: 25px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  color: #ffffff;
}

.register-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
  color: #ffffff;
}

/* Mobile menu toggle */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.menu-toggle span {
  width: 100%;
  height: 3px;
  background: #ffffff;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Responsive design */
@media (max-width: 1200px) {
  .nav-items {
    gap: 0.5rem;
  }
  
  .dropdown-toggle {
    min-width: 100px;
    padding: 0.75rem 1rem;
  }
  
  .dropdown-menu {
    min-width: 180px;
  }
}

@media (max-width: 992px) {
  .navbar-container {
    padding: 0 1rem;
  }
  
  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    height: calc(100vh - 70px);
    overflow-y: auto;
  }
  
  .nav-menu.nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-items {
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
  }
  
  .nav-dropdown {
    width: 100%;
  }
  
  .dropdown-toggle {
    width: 100%;
    justify-content: space-between;
    min-width: auto;
  }
  
  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    margin-top: 0.5rem;
    width: 100%;
    min-width: auto;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .user-info {
    display: none;
  }
  
  .auth-buttons {
    display: none;
  }
}

@media (max-width: 768px) {
  .brand-text {
    display: none;
  }
  
  .navbar-container {
    padding: 0 0.5rem;
  }
  
  .nav-items {
    padding: 1rem;
  }
  
  .dropdown-toggle {
    padding: 0.75rem;
  }
  
  .dropdown-item {
    padding: 0.75rem;
  }
}

/* Hide default dropdown arrow if any (for button.dropdown-toggle) */
.dropdown-toggle::after {
  display: none !important;
}
</style>
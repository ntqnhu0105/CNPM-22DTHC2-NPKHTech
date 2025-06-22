<template>
  <DefaultLayout>
    <section class="kh-header">
      <div class="kh-header-left">
        <i class="bi bi-person-circle kh-header-icon"></i>
        <div>
          <h1 class="kh-title">Quản lý khách hàng</h1>
          <p class="kh-desc">Tạo, chỉnh sửa và quản lý khách hàng dễ dàng.</p>
        </div>
      </div>
      <button
        class="kh-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo khách hàng mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm khách hàng</span>
      </button>
    </section>
    <section class="kh-content-card">
      <KhachHangList @edit="openEditModal" />
    </section>
    <KhachHangForm :modal-id="'createModal'" @saved="refreshList" />
    <KhachHangForm :modal-id="'editModal'" :khach-hang="selectedKhachHang" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import KhachHangList from '../components/KhachHangList.vue';
import KhachHangForm from '../components/KhachHangForm.vue';
import { useKhachHangStore } from '../stores/khachHang';

const store = useKhachHangStore();
const selectedKhachHang = ref(null);

const openEditModal = (khachHang) => {
  selectedKhachHang.value = khachHang;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const refreshList = () => {
  store.fetchKhachHangs();
  selectedKhachHang.value = null;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
body {
  font-family: 'Inter', sans-serif;
  background: #1A202C;
  color: #dde6ed;
}
.kh-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.kh-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.kh-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.kh-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.kh-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.kh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1A202C;
  color: #fff;
  border: 1.5px solid #ffffff;
  border-radius: 0.7rem;
  padding: 0.7rem 1.4rem;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.kh-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.kh-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
@media (max-width: 768px) {
  .kh-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .kh-header-left { gap: 0.7rem; }
  .kh-title { font-size: 1.3rem; }
  .kh-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .kh-content-card { padding: 1rem 0.5rem; }
}
</style> 
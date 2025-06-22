<template>
  <DefaultLayout>
    <section class="km-header">
      <div class="km-header-left">
        <i class="bi bi-gift-fill km-header-icon"></i>
        <div>
          <h1 class="km-title">Quản lý khuyến mãi</h1>
          <p class="km-desc">Tạo, chỉnh sửa và quản lý các chương trình khuyến mãi dễ dàng.</p>
        </div>
      </div>
      <button
        class="km-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo khuyến mãi mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm khuyến mãi</span>
      </button>
    </section>
    <section class="km-content-card">
      <KhuyenMaiList @edit="openEditModal" />
    </section>
    <KhuyenMaiForm :modal-id="'createModal'" @saved="refreshList" />
    <KhuyenMaiForm :modal-id="'editModal'" :khuyen-mai="selectedKhuyenMai" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import KhuyenMaiList from '../components/KhuyenMaiList.vue';
import KhuyenMaiForm from '../components/KhuyenMaiForm.vue';
import { useKhuyenMaiStore } from '../stores/khuyenMai';

const store = useKhuyenMaiStore();
const selectedKhuyenMai = ref(null);
let editModalInstance = null;

const openEditModal = (khuyenMai) => {
  selectedKhuyenMai.value = khuyenMai;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    editModalInstance = new Modal(modalElement);
    editModalInstance.show();
  }
};

const refreshList = () => {
  store.fetchKhuyenMais();
  // Do NOT reset selectedKhuyenMai here
};

// Reset selectedKhuyenMai only after modal is fully hidden
onMounted(() => {
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      selectedKhuyenMai.value = null;
    });
  }
});
onUnmounted(() => {
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', () => {
      selectedKhuyenMai.value = null;
    });
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.km-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.km-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.km-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.km-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.km-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.km-btn {
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
.km-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.km-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
@media (max-width: 768px) {
  .km-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .km-header-left { gap: 0.7rem; }
  .km-title { font-size: 1.3rem; }
  .km-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .km-content-card { padding: 1rem 0.5rem; }
}
</style> 
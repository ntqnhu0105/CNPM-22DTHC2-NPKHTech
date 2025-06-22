<template>
  <DefaultLayout>
    <section class="tt-header">
      <div class="tt-header-left">
        <i class="bi bi-credit-card-2-front-fill tt-header-icon"></i>
        <div>
          <h1 class="tt-title">Quản lý thanh toán</h1>
          <p class="tt-desc">Tạo, chỉnh sửa và quản lý các giao dịch thanh toán dễ dàng.</p>
        </div>
      </div>
      <button
        class="tt-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo thanh toán mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm thanh toán</span>
      </button>
    </section>
    <section class="tt-content-card">
      <ThanhToanList @edit="openEditModal" />
    </section>
    <ThanhToanForm :modal-id="'createModal'" @saved="refreshList" />
    <ThanhToanForm :modal-id="'editModal'" :thanh-toan="selectedThanhToan" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import ThanhToanList from '../components/ThanhToanList.vue';
import ThanhToanForm from '../components/ThanhToanForm.vue';
import { useThanhToanStore } from '../stores/thanhToan';

const store = useThanhToanStore();
const selectedThanhToan = ref(null);
let editModalInstance = null;

const openEditModal = (thanhToan) => {
  selectedThanhToan.value = thanhToan;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    editModalInstance = new Modal(modalElement);
    editModalInstance.show();
  }
};

const refreshList = () => {
  store.fetchThanhToans();
  // Do NOT reset selectedThanhToan here
};

onMounted(() => {
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      selectedThanhToan.value = null;
    });
  }
});
onUnmounted(() => {
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    modalElement.removeEventListener('hidden.bs.modal', () => {
      selectedThanhToan.value = null;
    });
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.tt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.tt-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.tt-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.tt-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.tt-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.tt-btn {
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
.tt-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.tt-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
@media (max-width: 768px) {
  .tt-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .tt-header-left { gap: 0.7rem; }
  .tt-title { font-size: 1.3rem; }
  .tt-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .tt-content-card { padding: 1rem 0.5rem; }
}
</style> 
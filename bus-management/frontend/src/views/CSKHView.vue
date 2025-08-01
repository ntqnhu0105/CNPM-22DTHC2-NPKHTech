<template>
  <DefaultLayout>
    <section class="cskh-header">
      <div class="cskh-header-left">
        <i class="bi bi-headset cskh-header-icon"></i>
        <div>
          <h1 class="cskh-title">Quản lý chăm sóc khách hàng</h1>
          <p class="cskh-desc">Tạo, chỉnh sửa và quản lý các yêu cầu chăm sóc khách hàng.</p>
        </div>
      </div>
      <button
        class="cskh-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo CSKH mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm CSKH</span>
      </button>
    </section>
    <section class="cskh-content-card">
      <CSKHList @edit="openEditModal" />
    </section>
    <CSKHForm :modal-id="'createModal'" @saved="refreshList" />
    <CSKHForm :modal-id="'editModal'" :cskh="selectedCSKH" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import CSKHList from '../components/CSKHList.vue';
import CSKHForm from '../components/CSKHForm.vue';
import { useCSKHStore } from '../stores/cskh';

const store = useCSKHStore();
const selectedCSKH = ref(null);

const openEditModal = (cskh) => {
  selectedCSKH.value = cskh;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const refreshList = () => {
  store.fetchCSKHs();
  selectedCSKH.value = null;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.cskh-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.cskh-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.cskh-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.cskh-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.cskh-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.cskh-btn {
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
.cskh-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.cskh-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
@media (max-width: 768px) {
  .cskh-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .cskh-header-left { gap: 0.7rem; }
  .cskh-title { font-size: 1.3rem; }
  .cskh-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .cskh-content-card { padding: 1rem 0.5rem; }
}
</style> 
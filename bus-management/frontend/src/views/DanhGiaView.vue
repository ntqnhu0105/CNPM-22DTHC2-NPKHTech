<template>
  <DefaultLayout>
    <section class="dg-header">
      <div class="dg-header-left">
        <i class="bi bi-star-fill dg-header-icon"></i>
        <div>
          <h1 class="dg-title">Quản lý đánh giá</h1>
          <p class="dg-desc">Tạo, chỉnh sửa và quản lý các đánh giá của khách hàng.</p>
        </div>
      </div>
      <button
        class="dg-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo đánh giá mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm đánh giá</span>
      </button>
    </section>
    <section class="dg-content-card">
      <DanhGiaList @edit="openEditModal" />
    </section>
    <DanhGiaForm :modal-id="'createModal'" @saved="refreshList" />
    <DanhGiaForm :modal-id="'editModal'" :danh-gia="selectedDanhGia" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import DanhGiaList from '../components/DanhGiaList.vue';
import DanhGiaForm from '../components/DanhGiaForm.vue';
import { useDanhGiaStore } from '../stores/danhGia';

const store = useDanhGiaStore();
const selectedDanhGia = ref(null);

const openEditModal = (danhGia) => {
  selectedDanhGia.value = danhGia;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const refreshList = () => {
  store.fetchDanhGias();
  selectedDanhGia.value = null;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.dg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.dg-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.dg-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.dg-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.dg-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.dg-btn {
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
.dg-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.dg-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
@media (max-width: 768px) {
  .dg-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .dg-header-left { gap: 0.7rem; }
  .dg-title { font-size: 1.3rem; }
  .dg-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .dg-content-card { padding: 1rem 0.5rem; }
}
</style> 
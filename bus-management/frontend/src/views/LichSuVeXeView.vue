<template>
  <DefaultLayout>
    <section class="lsvx-header">
      <div class="lsvx-header-left">
        <i class="bi bi-clock-history lsvx-header-icon"></i>
        <div>
          <h1 class="lsvx-title">Quản lý lịch sử vé xe</h1>
          <p class="lsvx-desc">Tạo, chỉnh sửa và quản lý lịch sử thay đổi của vé xe.</p>
        </div>
      </div>
      <button
        class="lsvx-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo lịch sử vé xe mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm lịch sử vé xe</span>
      </button>
    </section>
    <section class="lsvx-content-card">
      <LichSuVeXeList @edit="openEditModal" />
    </section>
    <LichSuVeXeForm :modal-id="'createModal'" @saved="refreshList" />
    <LichSuVeXeForm :modal-id="'editModal'" :lich-su-ve-xe="selectedLichSuVeXe" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import LichSuVeXeList from '../components/LichSuVeXeList.vue';
import LichSuVeXeForm from '../components/LichSuVeXeForm.vue';
import { useLichSuVeXeStore } from '../stores/lichSuVeXe';

const store = useLichSuVeXeStore();
const selectedLichSuVeXe = ref(null);

const openEditModal = (lichSuVeXe) => {
  selectedLichSuVeXe.value = lichSuVeXe;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const refreshList = () => {
  store.fetchLichSuVeXes();
  selectedLichSuVeXe.value = null;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.lsvx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.lsvx-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.lsvx-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.lsvx-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.lsvx-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.lsvx-btn {
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
.lsvx-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.lsvx-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
@media (max-width: 768px) {
  .lsvx-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .lsvx-header-left { gap: 0.7rem; }
  .lsvx-title { font-size: 1.3rem; }
  .lsvx-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .lsvx-content-card { padding: 1rem 0.5rem; }
}
</style> 
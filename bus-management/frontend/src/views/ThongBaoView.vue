<template>
  <DefaultLayout>
    <section class="tb-header">
      <div class="tb-header-left">
        <i class="bi bi-bell-fill tb-header-icon"></i>
        <div>
          <h1 class="tb-title">Quản lý thông báo</h1>
          <p class="tb-desc">Tạo, chỉnh sửa và quản lý các thông báo gửi đến khách hàng.</p>
        </div>
      </div>
      <button
        class="tb-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo thông báo mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm thông báo</span>
      </button>
    </section>
    <section class="tb-content-card">
      <ThongBaoList @edit="openEditModal" />
    </section>
    <ThongBaoForm :modal-id="'createModal'" @saved="refreshList" />
    <ThongBaoForm :modal-id="'editModal'" :thong-bao="selectedThongBao" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import ThongBaoList from '../components/ThongBaoList.vue';
import ThongBaoForm from '../components/ThongBaoForm.vue';
import { useThongBaoStore } from '../stores/thongBao';

const store = useThongBaoStore();
const selectedThongBao = ref(null);

const openEditModal = (thongBao) => {
  selectedThongBao.value = thongBao;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const refreshList = () => {
  store.fetchThongBaos();
  selectedThongBao.value = null;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.tb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.tb-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.tb-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.tb-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.tb-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.tb-btn {
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
.tb-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.tb-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
@media (max-width: 768px) {
  .tb-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .tb-header-left { gap: 0.7rem; }
  .tb-title { font-size: 1.3rem; }
  .tb-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .tb-content-card { padding: 1rem 0.5rem; }
}
</style> 
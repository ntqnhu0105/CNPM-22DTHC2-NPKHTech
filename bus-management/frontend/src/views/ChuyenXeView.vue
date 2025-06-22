<template>
  <DefaultLayout>
    <section class="cx-header">
      <div class="cx-header-left">
        <i class="bi bi-bus-front-fill cx-header-icon"></i>
        <div>
          <h1 class="cx-title">Quản lý chuyến xe</h1>
          <p class="cx-desc">Tạo, chỉnh sửa và quản lý chuyến xe dễ dàng.</p>
        </div>
      </div>
      <button
        class="cx-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo chuyến xe mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm chuyến xe</span>
      </button>
    </section>
    <section class="cx-content-card">
      <ChuyenXeList @edit="openEditModal" />
    </section>
    <ChuyenXeForm :modal-id="'createModal'" @saved="refreshList" />
    <ChuyenXeForm :modal-id="'editModal'" :chuyen-xe="selectedChuyenXe" @saved="refreshList" />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import ChuyenXeList from '../components/ChuyenXeList.vue';
import ChuyenXeForm from '../components/ChuyenXeForm.vue';
import { useChuyenXeStore } from '../stores/chuyenXe';

const store = useChuyenXeStore();
const selectedChuyenXe = ref(null);

const openEditModal = (chuyenXe) => {
  selectedChuyenXe.value = chuyenXe;
  const modalElement = document.getElementById('editModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const refreshList = () => {
  store.fetchChuyenXes();
  selectedChuyenXe.value = null;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
body {
  font-family: 'Inter', sans-serif;
  background: #1A202C;
  color: #dde6ed;
}
.cx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.cx-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.cx-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.cx-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.cx-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.cx-btn {
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
.cx-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.cx-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
@media (max-width: 768px) {
  .cx-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .cx-header-left { gap: 0.7rem; }
  .cx-title { font-size: 1.3rem; }
  .cx-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .cx-content-card { padding: 1rem 0.5rem; }
}
</style>
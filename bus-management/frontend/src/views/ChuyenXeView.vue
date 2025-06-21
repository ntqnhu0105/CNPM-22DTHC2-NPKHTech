<template>
  <DefaultLayout>
    <div class="container mt-4">
      <div class="d-flex justify-content-between mb-3">
        <h2>Quản lý chuyến xe</h2>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Tạo chuyến xe</button>
      </div>
      <ChuyenXeList @edit="openEditModal" />
      <ChuyenXeForm :modal-id="'createModal'" @saved="refreshList" />
      <ChuyenXeForm :modal-id="'editModal'" :chuyen-xe="selectedChuyenXe" @saved="refreshList" />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import ChuyenXeList from '../components/ChuyenXeList.vue';
import ChuyenXeForm from '../components/ChuyenXeForm.vue';
import { useChuyenXeStore } from '../stores/chuyenXe';

const store = useChuyenXeStore();
const selectedChuyenXe = ref(null);

const openEditModal = (chuyenXe) => {
  selectedChuyenXe.value = chuyenXe;
  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  modal.show();
};

const refreshList = () => {
  store.fetchChuyenXes();
  selectedChuyenXe.value = null;
};
</script>
<template>
  <DefaultLayout>
    <div class="container mt-4">
      <div class="d-flex justify-content-between mb-3">
        <h2>Quản lý nhà xe</h2>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Tạo nhà xe</button>
      </div>
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Tên nhà xe</th>
            <th>Địa chỉ</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nhaXe in store.nhaXes" :key="nhaXe._id">
            <td>{{ nhaXe.tenNhaXe }}</td>
            <td>{{ nhaXe.diaChi }}</td>
            <td>{{ nhaXe.email }}</td>
            <td>{{ nhaXe.sdt }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="openEditModal(nhaXe)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="store.deleteNhaXe(nhaXe._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchNhaXes(store.pagination.page - 1)">Trước</a>
          </li>
          <li
            class="page-item"
            v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)"
            :key="n"
            :class="{ active: n === store.pagination.page }"
          >
            <a class="page-link" @click="store.fetchNhaXes(n)">{{ n }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }"
          >
            <a class="page-link" @click="store.fetchNhaXes(store.pagination.page + 1)">Sau</a>
          </li>
        </ul>
      </nav>
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Tạo nhà xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="store.createNhaXe(form)">
                <div class="mb-3">
                  <label class="form-label">Tên nhà xe</label>
                  <input v-model="form.tenNhaXe" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <input v-model="form.diaChi" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="form.email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">SĐT</label>
                  <input v-model="form.sdt" type="text" class="form-control" pattern="[0-9]{10,11}" required />
                </div>
                <button type="submit" class="btn btn-primary">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Sửa nhà xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="store.updateNhaXe(selectedNhaXe._id, form)">
                <div class="mb-3">
                  <label class="form-label">Tên nhà xe</label>
                  <input v-model="form.tenNhaXe" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <input v-model="form.diaChi" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="form.email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">SĐT</label>
                  <input v-model="form.sdt" type="text" class="form-control" pattern="[0-9]{10,11}" required />
                </div>
                <button type="submit" class="btn btn-primary">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useNhaXeStore } from '../stores/nhaXe';
import { Modal } from 'bootstrap';

const store = useNhaXeStore();
const form = ref({ tenNhaXe: '', diaChi: '', email: '', sdt: '' });
const selectedNhaXe = ref(null);

store.fetchNhaXes();

const openEditModal = (nhaXe) => {
  selectedNhaXe.value = nhaXe;
  form.value = { ...nhaXe };
  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};
</script>
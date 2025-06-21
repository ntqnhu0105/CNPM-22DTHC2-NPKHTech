<template>
  <DefaultLayout>
    <div class="container mt-4">
      <div class="d-flex justify-content-between mb-3">
        <h2>Quản lý tuyến xe</h2>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Tạo tuyến xe</button>
      </div>
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Điểm đi</th>
            <th>Điểm đến</th>
            <th>Khoảng cách (km)</th>
            <th>Thời gian dự kiến</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tuyenXe in store.tuyenXes" :key="tuyenXe._id">
            <td>{{ tuyenXe.diemDi }}</td>
            <td>{{ tuyenXe.diemDen }}</td>
            <td>{{ tuyenXe.khoangCach || '-' }}</td>
            <td>{{ tuyenXe.thoiGianDuKien || '-' }}</td>
            <td>{{ tuyenXe.moTa || '-' }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="openEditModal(tuyenXe)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="store.deleteTuyenXe(tuyenXe._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchTuyenXes(store.pagination.page - 1)">Trước</a>
          </li>
          <li
            class="page-item"
            v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)"
            :key="n"
            :class="{ active: n === store.pagination.page }"
          >
            <a class="page-link" @click="store.fetchTuyenXes(n)">{{ n }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }"
          >
            <a class="page-link" @click="store.fetchTuyenXes(store.pagination.page + 1)">Sau</a>
          </li>
        </ul>
      </nav>
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Tạo tuyến xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="store.createTuyenXe(form)">
                <div class="mb-3">
                  <label class="form-label">Điểm đi</label>
                  <input v-model="form.diemDi" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Điểm đến</label>
                  <input v-model="form.diemDen" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Khoảng cách (km)</label>
                  <input v-model.number="form.khoangCach" type="number" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Thời gian dự kiến</label>
                  <input v-model="form.thoiGianDuKien" type="text" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Mô tả</label>
                  <textarea v-model="form.moTa" class="form-control" maxlength="200"></textarea>
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
              <h5 class="modal-title">Sửa tuyến xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="store.updateTuyenXe(selectedTuyenXe._id, form)">
                <div class="mb-3">
                  <label class="form-label">Điểm đi</label>
                  <input v-model="form.diemDi" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Điểm đến</label>
                  <input v-model="form.diemDen" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Khoảng cách (km)</label>
                  <input v-model.number="form.khoangCach" type="number" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Thời gian dự kiến</label>
                  <input v-model="form.thoiGianDuKien" type="text" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Mô tả</label>
                  <textarea v-model="form.moTa" class="form-control" maxlength="200"></textarea>
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
import { useTuyenXeStore } from '../stores/tuyenXe';
import { Modal } from 'bootstrap';

const store = useTuyenXeStore();
const form = ref({ diemDi: '', diemDen: '', khoangCach: null, thoiGianDuKien: '', moTa: '' });
const selectedTuyenXe = ref(null);

store.fetchTuyenXes();

const openEditModal = (tuyenXe) => {
  selectedTuyenXe.value = tuyenXe;
  form.value = { ...tuyenXe };
  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};
</script>
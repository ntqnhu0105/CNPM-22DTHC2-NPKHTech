<template>
  <DefaultLayout>
    <div class="container mt-4">
      <div class="d-flex justify-content-between mb-3">
        <h2>Quản lý tài xế</h2>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Tạo tài xế</button>
      </div>
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Bằng lái</th>
            <th>CCCD</th>
            <th>Ngày sinh</th>
            <th>SĐT</th>
            <th>Kinh nghiệm (năm)</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="taiXe in store.taiXes" :key="taiXe._id">
            <td>{{ taiXe.hoVaTen }}</td>
            <td>{{ taiXe.bangLai }}</td>
            <td>{{ taiXe.cccd || '-' }}</td>
            <td>{{ new Date(taiXe.ngaySinh).toLocaleDateString('vi-VN') }}</td>
            <td>{{ taiXe.sdt }}</td>
            <td>{{ taiXe.kinhNghiem }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="openEditModal(taiXe)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="store.deleteTaiXe(taiXe._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchTaiXes(store.pagination.page - 1)">Trước</a>
          </li>
          <li
            class="page-item"
            v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)"
            :key="n"
            :class="{ active: n === store.pagination.page }"
          >
            <a class="page-link" @click="store.fetchTaiXes(n)">{{ n }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }"
          >
            <a class="page-link" @click="store.fetchTaiXes(store.pagination.page + 1)">Sau</a>
          </li>
        </ul>
      </nav>
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Tạo tài xế</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="store.createTaiXe(form)">
                <div class="mb-3">
                  <label class="form-label">Họ và tên</label>
                  <input v-model="form.hoVaTen" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Bằng lái</label>
                  <input v-model="form.bangLai" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">CCCD</label>
                  <input v-model="form.cccd" type="text" class="form-control" maxlength="12" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Ngày sinh</label>
                  <input v-model="form.ngaySinh" type="date" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">SĐT</label>
                  <input v-model="form.sdt" type="text" class="form-control" pattern="[0-9]{10,11}" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Kinh nghiệm (năm)</label>
                  <input v-model.number="form.kinhNghiem" type="number" class="form-control" min="0" required />
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
              <h5 class="modal-title">Sửa tài xế</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="store.updateTaiXe(selectedTaiXe._id, form)">
                <div class="mb-3">
                  <label class="form-label">Họ và tên</label>
                  <input v-model="form.hoVaTen" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Bằng lái</label>
                  <input v-model="form.bangLai" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">CCCD</label>
                  <input v-model="form.cccd" type="text" class="form-control" maxlength="12" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Ngày sinh</label>
                  <input v-model="form.ngaySinh" type="date" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">SĐT</label>
                  <input v-model="form.sdt" type="text" class="form-control" pattern="[0-9]{10,11}" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Kinh nghiệm (năm)</label>
                  <input v-model.number="form.kinhNghiem" type="number" class="form-control" min="0" required />
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
import { useTaiXeStore } from '../stores/taiXe';
import { Modal } from 'bootstrap';

const store = useTaiXeStore();
const form = ref({ hoVaTen: '', bangLai: '', cccd: '', ngaySinh: '', sdt: '', kinhNghiem: 0 });
const selectedTaiXe = ref(null);

store.fetchTaiXes();

const openEditModal = (taiXe) => {
  selectedTaiXe.value = taiXe;
  form.value = { ...taiXe, ngaySinh: new Date(taiXe.ngaySinh).toISOString().slice(0, 10) };
  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};
</script>
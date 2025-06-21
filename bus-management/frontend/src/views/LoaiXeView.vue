```vue
<template>
  <DefaultLayout>
    <div class="container mt-4">
      <div class="d-flex justify-content-between mb-3">
        <h2>Quản lý loại xe</h2>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Tạo loại xe</button>
      </div>
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Tên loại xe</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loaiXe in store.loaiXes" :key="loaiXe._id">
            <td>{{ loaiXe.tenLoai }}</td>
            <td>{{ loaiXe.moTa || '-' }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="openEditModal(loaiXe)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="confirmDelete(loaiXe._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchLoaiXes(store.pagination.page - 1)">Trước</a>
          </li>
          <li
            class="page-item"
            v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)"
            :key="n"
            :class="{ active: n === store.pagination.page }"
          >
            <a class="page-link" @click="store.fetchLoaiXes(n)">{{ n }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }"
          >
            <a class="page-link" @click="store.fetchLoaiXes(store.pagination.page + 1)">Sau</a>
          </li>
        </ul>
      </nav>
      <!-- Create Modal -->
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Tạo loại xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createLoaiXe">
                <div class="mb-3">
                  <label class="form-label">Tên loại xe</label>
                  <input
                    v-model="form.tenLoai"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Nhập tên loại xe"
                  />
                  <small v-if="formErrors.tenLoai" class="text-danger">{{ formErrors.tenLoai }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mô tả</label>
                  <textarea
                    v-model="form.moTa"
                    class="form-control"
                    maxlength="100"
                    placeholder="Nhập mô tả (tối đa 100 ký tự)"
                  ></textarea>
                  <small v-if="formErrors.moTa" class="text-danger">{{ formErrors.moTa }}</small>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="store.loading">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Edit Modal -->
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Sửa loại xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateLoaiXe">
                <div class="mb-3">
                  <label class="form-label">Tên loại xe</label>
                  <input
                    v-model="form.tenLoai"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Nhập tên loại xe"
                  />
                  <small v-if="formErrors.tenLoai" class="text-danger">{{ formErrors.tenLoai }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mô tả</label>
                  <textarea
                    v-model="form.moTa"
                    class="form-control"
                    maxlength="100"
                    placeholder="Nhập mô tả (tối đa 100 ký tự)"
                  ></textarea>
                  <small v-if="formErrors.moTa" class="text-danger">{{ formErrors.moTa }}</small>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="store.loading">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useLoaiXeStore } from '../stores/loaiXe';
import { Modal } from 'bootstrap';
import { useToast } from 'vue-toastification';

const toast = useToast();
const store = useLoaiXeStore();
const form = reactive({ tenLoai: '', moTa: '' });
const formErrors = reactive({ tenLoai: '', moTa: '' });
const selectedLoaiXe = ref(null);

// Fetch initial data
store.fetchLoaiXes();

// Reset form and errors
const resetForm = () => {
  form.tenLoai = '';
  form.moTa = '';
  formErrors.tenLoai = '';
  formErrors.moTa = '';
};

// Basic client-side validation
const validateForm = () => {
  let isValid = true;
  formErrors.tenLoai = '';
  formErrors.moTa = '';

  if (!form.tenLoai.trim()) {
    formErrors.tenLoai = 'Tên loại xe là bắt buộc';
    isValid = false;
  }
  if (form.moTa && form.moTa.length > 100) {
    formErrors.moTa = 'Mô tả tối đa 100 ký tự';
    isValid = false;
  }
  return isValid;
};

// Create LoaiXe
const createLoaiXe = async () => {
  if (!validateForm()) return;

  try {
    await store.createLoaiXe({ ...form });
    const modal = Modal.getInstance(document.getElementById('createModal'));
    modal.hide();
    resetForm();
  } catch (error) {
    toast.error(error.message || 'Lỗi khi tạo loại xe');
  }
};

// Update LoaiXe
const updateLoaiXe = async () => {
  if (!validateForm()) return;

  try {
    await store.updateLoaiXe(selectedLoaiXe.value._id, { ...form });
    const modal = Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    resetForm();
  } catch (error) {
    toast.error(error.message || 'Lỗi khi cập nhật loại xe');
  }
};

// Open Edit Modal
const openEditModal = (loaiXe) => {
  selectedLoaiXe.value = loaiXe;
  form.tenLoai = loaiXe.tenLoai;
  form.moTa = loaiXe.moTa || '';
  formErrors.tenLoai = '';
  formErrors.moTa = '';
  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};

// Confirm Delete
const confirmDelete = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa loại xe này?')) {
    store.deleteLoaiXe(id);
  }
};
</script>
```
<template>
  <DefaultLayout>
    <section class="lx-header">
      <div class="lx-header-left">
        <i class="bi bi-car-front-fill lx-header-icon"></i>
        <div>
          <h1 class="lx-title">Quản lý loại xe</h1>
          <p class="lx-desc">Tạo, chỉnh sửa và quản lý loại xe dễ dàng.</p>
        </div>
      </div>
      <button
        class="lx-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo loại xe mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm loại xe</span>
      </button>
    </section>
    <section class="lx-content-card">
      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-else class="table-responsive">
        <table class="table lx-table mb-0">
          <thead>
            <tr>
              <th class="highlight-text">Tên loại xe</th>
              <th class="highlight-text">Mô tả</th>
              <th class="text-center highlight-text">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loaiXe in store.loaiXes" :key="loaiXe._id" class="table-row-hover">
              <td>{{ loaiXe.tenLoai }}</td>
              <td>{{ loaiXe.moTa || '-' }}</td>
              <td class="action-buttons text-center">
                <button class="action-btn text-edit-btn me-2" @click="openEditModal(loaiXe)" v-tooltip="'Sửa loại xe'">Sửa</button>
                <button class="action-btn text-delete-btn" @click="confirmDelete(loaiXe._id)" v-tooltip="'Xóa loại xe'">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <nav class="mt-4">
          <ul class="pagination justify-content-center lx-pagination">
            <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
              <a class="page-link" @click="store.fetchLoaiXes(store.pagination.page - 1)"><i class="bi bi-chevron-left"></i> Trước</a>
            </li>
            <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
              <a class="page-link" @click="store.fetchLoaiXes(n)">{{ n }}</a>
            </li>
            <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
              <a class="page-link" @click="store.fetchLoaiXes(store.pagination.page + 1)">Sau <i class="bi bi-chevron-right"></i></a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Create Modal -->
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content lx-modal-content">
            <div class="modal-header lx-modal-header">
              <h5 class="modal-title lx-modal-title">Tạo loại xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body lx-modal-body">
              <form @submit.prevent="createLoaiXe">
                <div class="mb-3">
                  <label class="lx-form-label">Tên loại xe</label>
                  <input
                    v-model="form.tenLoai"
                    type="text"
                    class="lx-form-input"
                    required
                    placeholder="Nhập tên loại xe"
                  />
                  <small v-if="formErrors.tenLoai" class="text-danger">{{ formErrors.tenLoai }}</small>
                </div>
                <div class="mb-3">
                  <label class="lx-form-label">Mô tả</label>
                  <textarea
                    v-model="form.moTa"
                    class="lx-form-input"
                    maxlength="100"
                    placeholder="Nhập mô tả (tối đa 100 ký tự)"
                  ></textarea>
                  <small v-if="formErrors.moTa" class="text-danger">{{ formErrors.moTa }}</small>
                </div>
                <button type="submit" class="lx-btn-submit" :disabled="store.loading">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Edit Modal -->
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content lx-modal-content">
            <div class="modal-header lx-modal-header">
              <h5 class="modal-title lx-modal-title">Sửa loại xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body lx-modal-body">
              <form @submit.prevent="updateLoaiXe">
                <div class="mb-3">
                  <label class="lx-form-label">Tên loại xe</label>
                  <input
                    v-model="form.tenLoai"
                    type="text"
                    class="lx-form-input"
                    required
                    placeholder="Nhập tên loại xe"
                  />
                  <small v-if="formErrors.tenLoai" class="text-danger">{{ formErrors.tenLoai }}</small>
                </div>
                <div class="mb-3">
                  <label class="lx-form-label">Mô tả</label>
                  <textarea
                    v-model="form.moTa"
                    class="lx-form-input"
                    maxlength="100"
                    placeholder="Nhập mô tả (tối đa 100 ký tự)"
                  ></textarea>
                  <small v-if="formErrors.moTa" class="text-danger">{{ formErrors.moTa }}</small>
                </div>
                <button type="submit" class="lx-btn-submit" :disabled="store.loading">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
body {
  font-family: 'Inter', sans-serif;
  background: #1A202C;
  color: #dde6ed;
}
.lx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.lx-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.lx-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.lx-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.lx-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.lx-btn {
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
.lx-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.lx-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
.lx-table {
  border-radius: 1.2rem;
  overflow: hidden;
  background: transparent;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.05);
}
.lx-table thead tr {
  background: linear-gradient(90deg, #5a5fcc 0%, #5190e0 100%);
}
.lx-table th {
  color: #1A202C;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  padding: 1.1rem 1rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  vertical-align: middle;
}
.highlight-text {
  color: #DDE6ED;
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.3);
}
.lx-table td {
  vertical-align: middle;
  font-size: 0.98rem;
  border-color: #2D3748;
  padding: 1rem 1rem;
  background: transparent;
  color: #dde6ed;
}
.table-row-hover:hover {
  background: #232936 !important;
  transition: background 0.2s ease-in-out;
}
.action-buttons {
  white-space: nowrap;
}
.action-btn {
  border-radius: 0.5rem;
  padding: 0.6em 1.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.text-edit-btn {
  background: #232946;
  color: #60A5FA;
  border: 1px solid #363b53;
}
.text-edit-btn:hover {
  background: #2d3650;
  color: #a5b4fc;
}
.text-delete-btn {
  background: #3b1d1d;
  color: #EF4444;
  border: 1px solid #5a2e2e;
}
.text-delete-btn:hover {
  background: #7f1d1d;
  color: #fee2e2;
}
.lx-pagination .page-item .page-link {
  border-radius: 0.75rem !important;
  margin: 0 0.25em;
  color: #6366f1;
  font-weight: 600;
  background: #232946;
  border: 1.5px solid #363b53;
  transition: all 0.2s ease;
  padding: 0.6em 1em;
  min-width: 2.5em;
  text-align: center;
}
.lx-pagination .page-item.active .page-link,
.lx-pagination .page-item .page-link:hover {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
}
.lx-pagination .page-item.disabled .page-link {
  background: #1A202C;
  color: #6b7280;
  border-color: #2D3748;
  cursor: not-allowed;
  opacity: 0.6;
}
.lx-modal-content {
  padding: 0 !important;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  background: #232946;
  border: 1.5px solid #363b53;
  color: #dde6ed;
  font-family: 'Inter', sans-serif;
}
.lx-modal-header {
  padding: 1.1rem 1.7rem 0.7rem 1.7rem !important;
  background: #1A202C;
  border-bottom: 1px solid #363b53;
  border-top-left-radius: 1.2rem;
  border-top-right-radius: 1.2rem;
}
.lx-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #a5b4fc;
  letter-spacing: -0.01em;
}
.btn-close {
  filter: invert(1) grayscale(1);
  opacity: 0.7;
}
.lx-modal-body {
  padding: 1.2rem 1.7rem !important;
  max-height: 70vh;
  overflow-y: auto;
}
.lx-form-label {
  color: #dde6ed;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 1rem;
}
.lx-form-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  border: 1.5px solid #363b53;
  background: #1A202C;
  color: #fff;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  margin-bottom: 1.1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(99,102,241,0.07);
}
.lx-form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99,102,241,0.13);
}
.lx-form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.lx-btn-submit {
  width: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  font-weight: 700;
  font-size: 1.08rem;
  padding: 0.8rem 0;
  margin-top: 0.2rem;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
  transition: background 0.2s, box-shadow 0.2s;
}
.lx-btn-submit:hover {
  background: #4f46e5;
  color: #fff;
}
@media (max-width: 768px) {
  .lx-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .lx-header-left { gap: 0.7rem; }
  .lx-title { font-size: 1.3rem; }
  .lx-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .lx-content-card { padding: 1rem 0.5rem; }
  .lx-modal-header, .lx-modal-body { padding: 0.7rem 0.7rem !important; }
  .lx-modal-content { border-radius: 0.7rem; }
}
.modal-dialog {
  margin-top: 15vh !important;
}
@media (max-width: 768px) {
  .modal-dialog {
    margin-top: 6vh !important;
  }
}
</style>
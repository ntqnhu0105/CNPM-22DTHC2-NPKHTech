<template>
  <DefaultLayout>
    <section class="xe-header">
      <div class="xe-header-left">
        <i class="bi bi-truck xe-header-icon"></i>
        <div>
          <h1 class="xe-title">Quản lý xe</h1>
          <p class="xe-desc">Tạo, chỉnh sửa và quản lý xe dễ dàng.</p>
        </div>
      </div>
      <button class="xe-btn" data-bs-toggle="modal" data-bs-target="#createModal">
        <i class="bi bi-plus-lg"></i>
        <span>Tạo xe</span>
      </button>
    </section>
    <section class="xe-content-card">
      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-else class="table-responsive">
        <table class="table xe-table mb-0">
          <thead>
            <tr>
              <th class="highlight-text">Biển số xe</th>
              <th class="highlight-text">Nhà xe</th>
              <th class="highlight-text">Loại xe</th>
              <th class="highlight-text">Số ghế</th>
              <th class="highlight-text">Trạng thái</th>
              <th class="text-center highlight-text">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="xe in store.xes" :key="xe._id" class="table-row-hover">
              <td>{{ xe.bienSoXe }}</td>
              <td>{{ xe.nhaXeId?.tenNhaXe || '-' }}</td>
              <td>{{ xe.loaiXeId?.tenLoai || '-' }}</td>
              <td>{{ xe.soGhe }}</td>
              <td>{{ xe.trangThai || '-' }}</td>
              <td class="action-buttons text-center">
                <button class="action-btn text-edit-btn me-2" @click="openEditModal(xe)">Sửa</button>
                <button class="action-btn text-delete-btn me-2" @click="confirmDelete(xe._id)">Xóa</button>
                <router-link :to="{ name: 'SoGheSoGiuong', query: { xeId: xe._id } }" class="action-btn text-info-btn">Quản lý ghế/giường</router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <nav class="mt-4">
          <ul class="pagination justify-content-center xe-pagination">
            <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
              <a class="page-link" @click="store.fetchXes(store.pagination.page - 1)"><i class="bi bi-chevron-left"></i> Trước</a>
            </li>
            <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
              <a class="page-link" @click="store.fetchXes(n)">{{ n }}</a>
            </li>
            <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
              <a class="page-link" @click="store.fetchXes(store.pagination.page + 1)">Sau <i class="bi bi-chevron-right"></i></a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Create Modal -->
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content xe-modal-content">
            <div class="modal-header xe-modal-header">
              <h5 class="modal-title xe-modal-title">Tạo xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body xe-modal-body">
              <form @submit.prevent="createXe">
                <div class="mb-3">
                  <label class="xe-form-label">Biển số xe</label>
                  <input v-model="form.bienSoXe" type="text" class="xe-form-input" required placeholder="Nhập biển số xe" />
                  <small v-if="formErrors.bienSoXe" class="text-danger">{{ formErrors.bienSoXe }}</small>
                </div>
                <div class="mb-3">
                  <label class="xe-form-label">Nhà xe</label>
                  <select v-model="form.nhaXeId" class="xe-form-input" required>
                    <option value="" disabled>Chọn nhà xe</option>
                    <option v-for="nhaXe in store.nhaXes" :key="nhaXe._id" :value="nhaXe._id">
                      {{ nhaXe.tenNhaXe }}
                    </option>
                  </select>
                  <small v-if="formErrors.nhaXeId" class="text-danger">{{ formErrors.nhaXeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="xe-form-label">Loại xe</label>
                  <select v-model="form.loaiXeId" class="xe-form-input" required>
                    <option value="" disabled>Chọn loại xe</option>
                    <option v-for="loaiXe in store.loaiXes" :key="loaiXe._id" :value="loaiXe._id">
                      {{ loaiXe.tenLoai }}
                    </option>
                  </select>
                  <small v-if="formErrors.loaiXeId" class="text-danger">{{ formErrors.loaiXeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="xe-form-label">Số ghế</label>
                  <input v-model.number="form.soGhe" type="number" class="xe-form-input" required min="1" placeholder="Nhập số ghế" />
                  <small v-if="formErrors.soGhe" class="text-danger">{{ formErrors.soGhe }}</small>
                </div>
                <div class="mb-3">
                  <label class="xe-form-label">Trạng thái</label>
                  <select v-model="form.trangThai" class="xe-form-input">
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                  </select>
                </div>
                <button type="submit" class="xe-btn-submit" :disabled="store.loading">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Edit Modal -->
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content xe-modal-content">
            <div class="modal-header xe-modal-header">
              <h5 class="modal-title xe-modal-title">Sửa xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body xe-modal-body">
              <form @submit.prevent="updateXe">
                <div class="mb-3">
                  <label class="xe-form-label">Biển số xe</label>
                  <input v-model="form.bienSoXe" type="text" class="xe-form-input" required placeholder="Nhập biển số xe" />
                  <small v-if="formErrors.bienSoXe" class="text-danger">{{ formErrors.bienSoXe }}</small>
                </div>
                <div class="mb-3">
                  <label class="xe-form-label">Nhà xe</label>
                  <select v-model="form.nhaXeId" class="xe-form-input" required>
                    <option value="" disabled>Chọn nhà xe</option>
                    <option v-for="nhaXe in store.nhaXes" :key="nhaXe._id" :value="nhaXe._id">
                      {{ nhaXe.tenNhaXe }}
                    </option>
                  </select>
                  <small v-if="formErrors.nhaXeId" class="text-danger">{{ formErrors.nhaXeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="xe-form-label">Loại xe</label>
                  <select v-model="form.loaiXeId" class="xe-form-input" required>
                    <option value="" disabled>Chọn loại xe</option>
                    <option v-for="loaiXe in store.loaiXes" :key="loaiXe._id" :value="loaiXe._id">
                      {{ loaiXe.tenLoai }}
                    </option>
                  </select>
                  <small v-if="formErrors.loaiXeId" class="text-danger">{{ formErrors.loaiXeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="xe-form-label">Số ghế</label>
                  <input v-model.number="form.soGhe" type="number" class="xe-form-input" required min="1" placeholder="Nhập số ghế" />
                  <small v-if="formErrors.soGhe" class="text-danger">{{ formErrors.soGhe }}</small>
                </div>
                <div class="mb-3">
                  <label class="xe-form-label">Trạng thái</label>
                  <select v-model="form.trangThai" class="xe-form-input">
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                  </select>
                </div>
                <button type="submit" class="xe-btn-submit" :disabled="store.loading">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useXeStore } from '../stores/xe';
import { Modal } from 'bootstrap';
import { useToast } from 'vue-toastification';

const toast = useToast();
const store = useXeStore();
const form = reactive({
  bienSoXe: '',
  nhaXeId: '',
  loaiXeId: '',
  soGhe: null,
  trangThai: 'Active',
});
const formErrors = reactive({
  bienSoXe: '',
  nhaXeId: '',
  loaiXeId: '',
  soGhe: '',
});
const selectedXe = ref(null);

// Fetch initial data
onMounted(() => {
  store.fetchXes();
  store.fetchDependencies();
});

// Reset form and errors
const resetForm = () => {
  form.bienSoXe = '';
  form.nhaXeId = '';
  form.loaiXeId = '';
  form.soGhe = null;
  form.trangThai = 'Active';
  formErrors.bienSoXe = '';
  formErrors.nhaXeId = '';
  formErrors.loaiXeId = '';
  formErrors.soGhe = '';
};

// Basic client-side validation
const validateForm = () => {
  let isValid = true;
  formErrors.bienSoXe = '';
  formErrors.nhaXeId = '';
  formErrors.loaiXeId = '';
  formErrors.soGhe = '';

  if (!form.bienSoXe.trim()) {
    formErrors.bienSoXe = 'Biển số xe là bắt buộc';
    isValid = false;
  }
  if (!form.nhaXeId) {
    formErrors.nhaXeId = 'Vui lòng chọn nhà xe';
    isValid = false;
  }
  if (!form.loaiXeId) {
    formErrors.loaiXeId = 'Vui lòng chọn loại xe';
    isValid = false;
  }
  if (!form.soGhe || form.soGhe < 1) {
    formErrors.soGhe = 'Số ghế phải là số nguyên dương';
    isValid = false;
  }
  return isValid;
};

// Create Xe
const createXe = async () => {
  if (!validateForm()) return;

  try {
    await store.createXe({ ...form });
    const modal = Modal.getInstance(document.getElementById('createModal'));
    modal.hide();
    resetForm();
  } catch (error) {
    toast.error(error.message || 'Lỗi khi tạo xe');
  }
};

// Update Xe
const updateXe = async () => {
  if (!validateForm()) return;

  try {
    await store.updateXe(selectedXe.value._id, { ...form });
    const modal = Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    resetForm();
  } catch (error) {
    toast.error(error.message || 'Lỗi khi cập nhật xe');
  }
};

// Open Edit Modal
const openEditModal = (xe) => {
  selectedXe.value = xe;
  form.bienSoXe = xe.bienSoXe;
  form.nhaXeId = xe.nhaXeId?._id || '';
  form.loaiXeId = xe.loaiXeId?._id || '';
  form.soGhe = xe.soGhe;
  form.trangThai = xe.trangThai || 'Active';
  formErrors.bienSoXe = '';
  formErrors.nhaXeId = '';
  formErrors.loaiXeId = '';
  formErrors.soGhe = '';
  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};

// Confirm Delete
const confirmDelete = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa xe này?')) {
    store.deleteXe(id);
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
.xe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.xe-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.xe-header-icon {
  font-size: 2.2rem;
  color: #ffffff;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.xe-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.xe-desc {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
}
.xe-btn {
  Display: flex;
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
.xe-btn:hover {
  Background: #0000004f;
  border-color: #6b6b6b;
}
.xe-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;

  min-height: 400px;
}
.xe-table {
  border-radius: 1.2rem;
  overflow: hidden;
  background: transparent;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.05);
}
.xe-table thead tr {
  background: linear-gradient(90deg, #5a5fcc 0%, #5190e0 100%);
}
.xe-table th {
  color: #000000;
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
.xe-table td {
  vertical-align: middle;
  font-size: 0.98rem;
  border-color: #2D3748;
  padding: 1rem 1rem;
  background: transparent;
  color: #dde6ed;
}
.table-row-hover:hover {
  background: #1A202C !important;
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
  margin-bottom: 0.2rem;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.text-edit-btn {
  background: #1A202C;
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
.text-info-btn {
  background: #1A202C;
  color: #81e986;
  border: 1px solid #055f2e;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
  padding: 0.6em 1.2em;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  display: inline-flex;
  align-items: center;
}
.text-info-btn:hover {
  background: #003619;
  color: #fff;
  border-color: #09751b;
}
.xe-pagination .page-item .page-link {
  border-radius: 0.75rem !important;
  margin: 0 0.25em;
  color: #6366f1;
  font-weight: 600;
  background: #1A202C;
  border: 1.5px solid #363b53;
  transition: all 0.2s ease;
  padding: 0.6em 1em;
  min-width: 2.5em;
  text-align: center;
}
.xe-pagination .page-item.active .page-link,
.xe-pagination .page-item .page-link:hover {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
}
.xe-pagination .page-item.disabled .page-link {
  background: #1A202C;
  color: #6b7280;
  border-color: #2D3748;
  cursor: not-allowed;
  opacity: 0.6;
}
/* Modal Styling */
.xe-modal-content {
  padding: 0 !important;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  background: #1A202C;
  border: 1.5px solid #363b53;
  color: #dde6ed;
  font-family: 'Inter', sans-serif;
}
.xe-modal-header {
  padding: 1.1rem 1.7rem 0.7rem 1.7rem !important;
  background: #1A202C;
  border-bottom: 1px solid #363b53;
  border-top-left-radius: 1.2rem;
  border-top-right-radius: 1.2rem;
}
.xe-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #a5b4fc;
  letter-spacing: -0.01em;
}
.btn-close {
  filter: invert(1) grayscale(1);
  opacity: 0.7;
}
.xe-modal-body {
  padding: 1.2rem 1.7rem !important;
  max-height: 70vh;
  overflow-y: auto;
}
.xe-form-label {
  color: #dde6ed;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 1rem;
}
.xe-form-input {
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
.xe-form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99,102,241,0.13);
}
.xe-form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.xe-btn-submit {
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
.xe-btn-submit:hover {
  background: #4f46e5;
  color: #fff;
}
@media (max-width: 768px) {
  .xe-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .xe-header-left { gap: 0.7rem; }
  .xe-title { font-size: 1.3rem; }
  .xe-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .xe-content-card { padding: 1rem 0.5rem; }
  .xe-modal-header, .xe-modal-body { padding: 0.7rem 0.7rem !important; }
  .xe-modal-content { border-radius: 0.7rem; }
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
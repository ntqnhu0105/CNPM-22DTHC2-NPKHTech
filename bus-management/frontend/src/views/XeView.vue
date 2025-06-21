```vue
<template>
  <DefaultLayout>
    <div class="container mt-4">
      <div class="d-flex justify-content-between mb-3">
        <h2>Quản lý xe</h2>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Tạo xe</button>
      </div>
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Biển số xe</th>
            <th>Nhà xe</th>
            <th>Loại xe</th>
            <th>Số ghế</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="xe in store.xes" :key="xe._id">
            <td>{{ xe.bienSoXe }}</td>
            <td>{{ xe.nhaXeId?.tenNhaXe || '-' }}</td>
            <td>{{ xe.loaiXeId?.tenLoai || '-' }}</td>
            <td>{{ xe.soGhe }}</td>
            <td>{{ xe.trangThai || '-' }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="openEditModal(xe)">Sửa</button>
              <button class="btn btn-sm btn-danger me-2" @click="confirmDelete(xe._id)">Xóa</button>
              <router-link :to="{ name: 'SoGheSoGiuong', query: { xeId: xe._id } }" class="btn btn-sm btn-info">Quản lý ghế/giường</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchXes(store.pagination.page - 1)">Trước</a>
          </li>
          <li
            class="page-item"
            v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)"
            :key="n"
            :class="{ active: n === store.pagination.page }"
          >
            <a class="page-link" @click="store.fetchXes(n)">{{ n }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }"
          >
            <a class="page-link" @click="store.fetchXes(store.pagination.page + 1)">Sau</a>
          </li>
        </ul>
      </nav>
      <!-- Create Modal -->
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Tạo xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createXe">
                <div class="mb-3">
                  <label class="form-label">Biển số xe</label>
                  <input
                    v-model="form.bienSoXe"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Nhập biển số xe"
                  />
                  <small v-if="formErrors.bienSoXe" class="text-danger">{{ formErrors.bienSoXe }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nhà xe</label>
                  <select v-model="form.nhaXeId" class="form-control" required>
                    <option value="" disabled>Chọn nhà xe</option>
                    <option v-for="nhaXe in store.nhaXes" :key="nhaXe._id" :value="nhaXe._id">
                      {{ nhaXe.tenNhaXe }}
                    </option>
                  </select>
                  <small v-if="formErrors.nhaXeId" class="text-danger">{{ formErrors.nhaXeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Loại xe</label>
                  <select v-model="form.loaiXeId" class="form-control" required>
                    <option value="" disabled>Chọn loại xe</option>
                    <option v-for="loaiXe in store.loaiXes" :key="loaiXe._id" :value="loaiXe._id">
                      {{ loaiXe.tenLoai }}
                    </option>
                  </select>
                  <small v-if="formErrors.loaiXeId" class="text-danger">{{ formErrors.loaiXeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Số ghế</label>
                  <input
                    v-model.number="form.soGhe"
                    type="number"
                    class="form-control"
                    required
                    min="1"
                    placeholder="Nhập số ghế"
                  />
                  <small v-if="formErrors.soGhe" class="text-danger">{{ formErrors.soGhe }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Trạng thái</label>
                  <select v-model="form.trangThai" class="form-control">
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                  </select>
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
              <h5 class="modal-title">Sửa xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateXe">
                <div class="mb-3">
                  <label class="form-label">Biển số xe</label>
                  <input
                    v-model="form.bienSoXe"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Nhập biển số xe"
                  />
                  <small v-if="formErrors.bienSoXe" class="text-danger">{{ formErrors.bienSoXe }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nhà xe</label>
                  <select v-model="form.nhaXeId" class="form-control" required>
                    <option value="" disabled>Chọn nhà xe</option>
                    <option v-for="nhaXe in store.nhaXes" :key="nhaXe._id" :value="nhaXe._id">
                      {{ nhaXe.tenNhaXe }}
                    </option>
                  </select>
                  <small v-if="formErrors.nhaXeId" class="text-danger">{{ formErrors.nhaXeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Loại xe</label>
                  <select v-model="form.loaiXeId" class="form-control" required>
                    <option value="" disabled>Chọn loại xe</option>
                    <option v-for="loaiXe in store.loaiXes" :key="loaiXe._id" :value="loaiXe._id">
                      {{ loaiXe.tenLoai }}
                    </option>
                  </select>
                  <small v-if="formErrors.loaiXeId" class="text-danger">{{ formErrors.loaiXeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Số ghế</label>
                  <input
                    v-model.number="form.soGhe"
                    type="number"
                    class="form-control"
                    required
                    min="1"
                    placeholder="Nhập số ghế"
                  />
                  <small v-if="formErrors.soGhe" class="text-danger">{{ formErrors.soGhe }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Trạng thái</label>
                  <select v-model="form.trangThai" class="form-control">
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                  </select>
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
```
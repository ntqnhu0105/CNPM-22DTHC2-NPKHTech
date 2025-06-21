```vue
<template>
  <DefaultLayout>
    <div class="container mt-4">
      <div class="d-flex justify-content-between mb-3 align-items-center">
        <h2>Quản lý số ghế/số giường</h2>
        <div>
          <select v-model="selectedXeId" class="form-select d-inline-block w-auto me-2" @change="fetchSeats">
            <option value="" disabled>Chọn xe</option>
            <option v-for="xe in store.xes" :key="xe._id" :value="xe._id">
              {{ xe.bienSoXe }} ({{ xe.loaiXeId?.tenLoai || '-' }})
            </option>
          </select>
          <button class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#createModal" ref="createButton">Tạo ghế/giường</button>
          <button class="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#bulkCreateModal" :disabled="!selectedXeId">Tạo hàng loạt</button>
          <button class="btn btn-danger" @click="confirmDeleteAllSeats" :disabled="!selectedXeId">Xóa tất cả ghế</button>
        </div>
      </div>
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <div v-else-if="!selectedXeId" class="alert alert-info">
        Vui lòng chọn một xe để xem sơ đồ ghế/giường.
      </div>
      <div v-else class="seat-map" role="grid" aria-label="Sơ đồ ghế/giường">
        <div class="seat-map-container">
          <div v-for="seat in store.soGheSoGiuongs" :key="seat._id" class="seat"
               :class="{ 'booked': seat.trangThai === 'Booked', 'available': seat.trangThai === 'Available' }"
               role="gridcell"
               :aria-label="`Ghế ${seat.maSoGhe}, trạng thái: ${seat.trangThai === 'Available' ? 'Còn trống' : 'Đã đặt'}`"
               tabindex="0"
               @click="openEditModal(seat)"
               @keyup.enter.prevent="openEditModal(seat)">
            {{ seat.maSoGhe }}
          </div>
        </div>
      </div>
      <!-- Create Modal -->
      <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" :aria-hidden="createModalHidden">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="createModalLabel">Tạo ghế/giường</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createSoGhe">
                <div class="mb-3">
                  <label class="form-label">Mã số ghế/giường</label>
                  <input
                    v-model="form.maSoGhe"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Nhập mã (ví dụ: A1, Bed1)"
                  />
                  <small v-if="formErrors.maSoGhe" class="text-danger">{{ formErrors.maSoGhe }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Xe</label>
                  <select v-model="form.xeId" class="form-control" required>
                    <option value="" disabled>Chọn xe</option>
                    <option v-for="xe in store.xes" :key="xe._id" :value="xe._id">
                      {{ xe.bienSoXe }} ({{ xe.loaiXeId?.tenLoai || '-' }})
                    </option>
                  </select>
                  <small v-if="formErrors.xeId" class="text-danger">{{ formErrors.xeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Trạng thái</label>
                  <select v-model="form.trangThai" class="form-control">
                    <option value="Available">Còn trống</option>
                    <option value="Booked">Đã đặt</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="store.loading">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Bulk Create Modal -->
      <div class="modal fade" id="bulkCreateModal" tabindex="-1" aria-labelledby="bulkCreateModalLabel" :aria-hidden="bulkCreateModalHidden">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="bulkCreateModalLabel">Tạo hàng loạt số ghế/số giường</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetBulkForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="bulkCreateSoGheSoGiuong">
                <div class="mb-3">
                  <label class="form-label">Số lượng ghế/giường</label>
                  <input
                    v-model.number="bulkForm.soGhe"
                    type="number"
                    class="form-control"
                    required
                    :max="store.selectedXe?.soGhe"
                    min="1"
                    :placeholder="`Tối đa ${store.selectedXe?.soGhe || 0}`"
                  />
                  <small v-if="bulkFormErrors.soGhe" class="text-danger">{{ bulkFormErrors.soGhe }}</small>
                </div>
                <div class="mb-3 form-check">
                  <input
                    v-model="bulkForm.force"
                    type="checkbox"
                    class="form-check-input"
                    id="forceCreate"
                  />
                  <label class="form-check-label" for="forceCreate">
                    Xóa ghế/giường hiện tại và tạo mới
                  </label>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="store.loading">Tạo</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Edit Modal -->
      <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" :aria-hidden="editModalHidden">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Sửa số ghế/số giường</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateSoGheSoGiuong">
                <div class="mb-3">
                  <label class="form-label">Mã số ghế/giường</label>
                  <input
                    v-model="form.maSoGhe"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Nhập mã (ví dụ: A1, Bed1)"
                  />
                  <small v-if="formErrors.maSoGhe" class="text-danger">{{ formErrors.maSoGhe }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Xe</label>
                  <select v-model="form.xeId" class="form-control" required>
                    <option value="" disabled>Chọn xe</option>
                    <option v-for="xe in store.xes" :key="xe._id" :value="xe._id">
                      {{ xe.bienSoXe }} ({{ xe.loaiXeId?.tenLoai || '-' }})
                    </option>
                  </select>
                  <small v-if="formErrors.xeId" class="text-danger">{{ formErrors.xeId }}</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Trạng thái</label>
                  <select v-model="form.trangThai" class="form-control">
                    <option value="Available">Còn trống</option>
                    <option value="Booked">Đã đặt</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="store.loading">Lưu</button>
                <button type="button" class="btn btn-danger mt-2" @click="confirmDelete(selectedSoGhe?._id)">Xóa</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useSoGheSoGiuongStore } from '../stores/soGheSoGiuong';
import { Modal } from 'bootstrap';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const store = useSoGheSoGiuongStore();
const form = reactive({
  maSoGhe: '',
  xeId: '',
  trangThai: 'Available',
});
const bulkForm = reactive({
  soGhe: null,
  force: false,
});
const formErrors = reactive({
  maSoGhe: '',
  xeId: '',
});
const bulkFormErrors = reactive({
  soGhe: '',
});
const selectedSoGhe = ref(null);
const selectedXeId = ref(route.query.xeId || '');
const createButton = ref(null);
const createModalHidden = ref(true);
const editModalHidden = ref(true);
const bulkCreateModalHidden = ref(true);

// Fetch initial data
onMounted(() => {
  console.log('Mounted: selectedXeId:', selectedXeId.value);
  store.fetchDependencies();
  if (selectedXeId.value) {
    store.fetchSoGheSoGiuongs(1, 100, selectedXeId.value);
  }
});

// Watch for route changes
watch(() => route.query.xeId, (newXeId) => {
  console.log('Route xeId changed:', newXeId);
  selectedXeId.value = newXeId || '';
  if (newXeId) {
    store.fetchSoGheSoGiuongs(1, 100, newXeId);
  } else {
    store.soGheSoGiuongs = [];
    store.selectedXe = null;
  }
});

// Reset form
const resetForm = () => {
  form.maSoGhe = '';
  form.xeId = selectedXeId.value || '';
  form.trangThai = 'Available';
  formErrors.maSoGhe = '';
  formErrors.xeId = '';
  createModalHidden.value = true;
  editModalHidden.value = true;
  if (createButton.value) {
    createButton.value.focus();
  }
};

// Reset bulk form
const resetBulkForm = () => {
  bulkForm.soGhe = store.selectedXe?.soGhe || null;
  bulkForm.force = false;
  bulkFormErrors.soGhe = '';
  bulkCreateModalHidden.value = true;
  if (createButton.value) {
    createButton.value.focus();
  }
};

// Validate form
const validateForm = () => {
  let isValid = true;
  formErrors.maSoGhe = '';
  formErrors.xeId = '';
  if (!form.maSoGhe.trim()) {
    formErrors.maSoGhe = 'Mã số ghế/giường là bắt buộc';
    isValid = false;
  }
  if (!form.xeId) {
    formErrors.xeId = 'Vui lòng chọn xe';
    isValid = false;
  }
  return isValid;
};

// Validate bulk form
const validateBulkForm = () => {
  let isValid = true;
  bulkFormErrors.soGhe = '';
  if (!selectedXeId.value) {
    bulkFormErrors.soGhe = 'Vui lòng chọn xe trước khi tạo hàng loạt';
    isValid = false;
  }
  if (!bulkForm.soGhe || bulkForm.soGhe <= 0) {
    bulkFormErrors.soGhe = 'Số ghế/giường phải là số nguyên dương';
    isValid = false;
  } else if (!store.selectedXe || bulkForm.soGhe > (store.selectedXe.soGhe || 0)) {
    bulkFormErrors.soGhe = `Số ghế/giường không được vượt quá ${store.selectedXe?.soGhe || 0}`;
    isValid = false;
  }
  return isValid;
};

// Create seat
const createSoGhe = async () => {
  if (!validateForm()) return;
  try {
    createModalHidden.value = false;
    console.log('Creating seat:', form);
    await store.createSoGheSoGiuong({ ...form });
    selectedXeId.value = form.xeId;
    console.log('Set selectedXeId after create:', selectedXeId.value);
    const modal = Modal.getInstance(document.getElementById('createModal'));
    modal.hide();
    resetForm();
  } catch (error) {
    console.error('Error creating seat:', error);
    toast.error(error.message || 'Lỗi khi tạo số ghế/số giường');
  } finally {
    createModalHidden.value = true;
  }
};

// Bulk create seats
const bulkCreateSoGheSoGiuong = async () => {
  if (!validateBulkForm()) return;
  try {
    bulkCreateModalHidden.value = false;
    console.log('Bulk creating seats:', { xeId: selectedXeId.value, soGhe: bulkForm.soGhe, force: bulkForm.force });
    await store.bulkCreateSoGheSoGiuong(selectedXeId.value, bulkForm.soGhe, bulkForm.force);
    const modal = Modal.getInstance(document.getElementById('bulkCreateModal')) || new Modal(document.getElementById('bulkCreateModal'));
    modal.hide();
    resetBulkForm();
    toast.success('Tạo hàng loạt số ghế/số giường thành công');
  } catch (error) {
    console.error('Error bulk creating seats:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    if (error.response?.data?.error === 'Xe đã có ghế/giường, sử dụng force=true để xóa và tạo mới') {
      toast.error('Xe đã có ghế/giường, vui lòng chọn "Xóa ghế/giường hiện tại và tạo mới"');
    } else {
      toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Lỗi khi tạo hàng loạt số ghế/số giường');
    }
  } finally {
    bulkCreateModalHidden.value = true;
  }
};

// Update seat
const updateSoGheSoGiuong = async () => {
  if (!validateForm()) return;
  try {
    editModalHidden.value = false;
    console.log('Updating seat:', { id: selectedSoGhe.value._id, ...form });
    await store.updateSoGheSoGiuong(selectedSoGhe.value._id, { ...form });
    selectedXeId.value = form.xeId;
    console.log('Set selectedXeId after update:', selectedXeId.value);
    const modal = Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    resetForm();
  } catch (error) {
    console.error('Error updating seat:', error);
    toast.error(error.message || 'Lỗi khi cập nhật số ghế/số giường');
  } finally {
    editModalHidden.value = true;
  }
};

// Open edit modal
const openEditModal = (soGhe) => {
  selectedSoGhe.value = soGhe;
  form.maSoGhe = soGhe.maSoGhe;
  form.xeId = soGhe.xeId?._id || soGhe.xeId || '';
  form.trangThai = soGhe.trangThai || 'Available';
  formErrors.maSoGhe = '';
  formErrors.xeId = '';
  editModalHidden.value = false;
  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};

// Delete seat
const confirmDelete = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa số ghế/số giường này?')) {
    console.log('Deleting seat:', id);
    store.deleteSoGheSoGiuong(id);
    const modal = Modal.getInstance(document.getElementById('editModal'));
    if (modal) modal.hide();
    resetForm();
  }
};

// Delete all seats
const confirmDeleteAllSeats = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả ghế/giường của xe này?')) {
    console.log('Deleting all seats for xeId:', selectedXeId.value);
    store.deleteAllSoGheSoGiuongByXeId(selectedXeId.value);
  }
};

// Fetch seats when xeId changes
const fetchSeats = () => {
  if (selectedXeId.value) {
    console.log('Fetching seats for xeId:', selectedXeId.value);
    store.fetchSoGheSoGiuongs(1, 100, selectedXeId.value);
  } else {
    store.soGheSoGiuongs = [];
    store.selectedXe = null;
  }
};
</script>

<style scoped>
.seat-map {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.seat-map-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 2 seats, 1 aisle, 2 seats */
  gap: 10px;
  justify-items: center;
}

.seat {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: bold;
  transition: transform 0.2s;
}

.seat.available {
  background: #28a745;
  color: white;
}

.seat.booked {
  background: #dc3545;
  color: white;
}

.seat:hover, .seat:focus {
  transform: scale(1.1);
  outline: 2px solid #007bff;
}

/* Aisle (empty column) */
.seat-map-container > :nth-child(5n+3) {
  background: transparent;
  cursor: default;
  height: 0;
}

.seat-map-container > :nth-child(5n+3):hover, .seat-map-container > :nth-child(5n+3):focus {
  transform: none;
  outline: none;
}
</style>
```
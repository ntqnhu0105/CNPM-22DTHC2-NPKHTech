<template>
  <div class="modal fade" :id="modalId" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content rounded-lg shadow-light animate-scale-in">
        <div class="modal-header">
          <h5 class="modal-title text-gradient">{{ isEdit.value ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Tên khuyến mãi</label>
              <input v-model="form.tenKhuyenMai" type="text" class="form-input" required maxlength="100" placeholder="Nhập tên khuyến mãi" />
            </div>
            <div class="mb-3">
              <label class="form-label">Phần trăm giảm giá (%)</label>
              <input v-model.number="form.phanTramGiamGia" type="number" class="form-input" required min="0" max="100" placeholder="Nhập phần trăm giảm giá" />
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày bắt đầu</label>
              <input v-model="form.ngayBatDau" type="date" class="form-input" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày kết thúc</label>
              <input v-model="form.ngayKetThuc" type="date" class="form-input" required />
            </div>
            <div class="mb-3" v-if="isEdit.value">
              <label class="form-label">Trạng thái</label>
              <select v-model="form.trangThai" class="form-input">
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Không hoạt động</option>
                <option value="Expired">Hết hạn</option>
              </select>
            </div>
            <button type="submit" class="btn bg-gradient w-100 mt-2 text-light fw-bold">{{ isEdit.value ? 'Cập nhật' : 'Tạo mới' }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useKhuyenMaiStore } from '../stores/khuyenMai';
import { Modal } from 'bootstrap';

const props = defineProps({
  khuyenMai: Object,
  modalId: { type: String, required: true },
});
const emit = defineEmits(['saved']);

const store = useKhuyenMaiStore();
const isEdit = computed(() => !!props.khuyenMai?._id);
const form = ref({
  tenKhuyenMai: '',
  phanTramGiamGia: 0,
  ngayBatDau: '',
  ngayKetThuc: '',
  trangThai: 'Active',
});

watch(
  () => props.khuyenMai,
  (newKhuyenMai) => {
    if (newKhuyenMai) {
      form.value = {
        tenKhuyenMai: newKhuyenMai.tenKhuyenMai,
        phanTramGiamGia: newKhuyenMai.phanTramGiamGia,
        ngayBatDau: new Date(newKhuyenMai.ngayBatDau).toISOString().split('T')[0],
        ngayKetThuc: new Date(newKhuyenMai.ngayKetThuc).toISOString().split('T')[0],
        trangThai: newKhuyenMai.trangThai,
      };
    }
  },
  { immediate: true }
);

const submitForm = async () => {
  try {
    if (isEdit.value) {
      await store.updateKhuyenMai(props.khuyenMai._id, form.value);
    } else {
      await store.createKhuyenMai(form.value);
    }
    const modal = Modal.getInstance(document.getElementById(props.modalId));
    modal.hide();
    emit('saved');
  } catch (error) {
    // Error is handled in store
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.modal-content {
  padding: 0 !important;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  background: #232946;
  border: 1.5px solid #363b53;
  color: #dde6ed;
  font-family: 'Inter', sans-serif;
}
.modal-header {
  padding: 1.1rem 1.7rem 0.7rem 1.7rem !important;
  background: #1A202C;
  border-bottom: 1px solid #363b53;
  border-top-left-radius: 1.2rem;
  border-top-right-radius: 1.2rem;
}
.modal-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #a5b4fc;
  letter-spacing: -0.01em;
}
.btn-close {
  filter: invert(1) grayscale(1);
  opacity: 0.7;
}
.modal-body {
  padding: 1.2rem 1.7rem !important;
  max-height: 70vh;
  overflow-y: auto;
}
.form-label {
  color: #dde6ed;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 1rem;
}
.form-input, .form-select, select, input[type="number"], input[type="date"] {
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
.form-input:focus, .form-select:focus, select:focus, input[type="number"]:focus, input[type="date"]:focus {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99,102,241,0.13);
}
.form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.btn.bg-gradient {
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
.btn.bg-gradient:hover {
  background: #4f46e5;
  color: #fff;
}
@media (max-width: 768px) {
  .modal-header, .modal-body {
    padding: 0.7rem 0.7rem !important;
  }
  .modal-content {
    border-radius: 0.7rem;
  }
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
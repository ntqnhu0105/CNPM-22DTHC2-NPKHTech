<template>
  <div class="modal fade" :id="modalId" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content rounded-lg shadow-light animate-scale-in">
        <div class="modal-header">
          <h5 class="modal-title text-gradient">{{ isEdit ? 'Sửa khách hàng' : 'Tạo khách hàng' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">CCCD</label>
              <input v-model="form.cccd" type="text" class="form-input" required maxlength="12" pattern="[0-9]{12}" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-input" required maxlength="50" />
            </div>
            <div class="mb-3">
              <label class="form-label">Họ và tên</label>
              <input v-model="form.hoVaTen" type="text" class="form-input" required maxlength="50" />
            </div>
            <div class="mb-3">
              <label class="form-label">Số điện thoại</label>
              <input v-model="form.sdt" type="text" class="form-input" required maxlength="11" pattern="[0-9]{10,11}" />
            </div>
            <div class="mb-3">
              <label class="form-label">Địa chỉ</label>
              <input v-model="form.diaChi" type="text" class="form-input" maxlength="100" />
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày sinh</label>
              <input v-model="form.ngaySinh" type="date" class="form-input" />
            </div>
            <div class="text-end">
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn bg-gradient fw-bold">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useKhachHangStore } from '../stores/khachHang';
import { Modal } from 'bootstrap';

const props = defineProps({
  khachHang: Object,
  modalId: { type: String, required: true },
});
const emit = defineEmits(['saved']);

const store = useKhachHangStore();
const isEdit = !!props.khachHang?._id;
const form = ref({
  email: '',
  hoVaTen: '',
  sdt: '',
  cccd: '',
  diaChi: '',
  ngaySinh: '',
});

watch(
  () => props.khachHang,
  (newKhachHang) => {
    if (newKhachHang) {
      form.value = {
        email: newKhachHang.email,
        hoVaTen: newKhachHang.hoVaTen,
        sdt: newKhachHang.sdt,
        cccd: newKhachHang.cccd,
        diaChi: newKhachHang.diaChi,
        ngaySinh: newKhachHang.ngaySinh ? new Date(newKhachHang.ngaySinh).toISOString().split('T')[0] : '',
      };
    } else {
      // Reset form khi không có khachHang (tạo mới)
      form.value = {
        email: '',
        hoVaTen: '',
        sdt: '',
        cccd: '',
        diaChi: '',
        ngaySinh: '',
      };
    }
  },
  { immediate: true }
);

const submitForm = async () => {
  try {
    if (isEdit) {
      await store.updateKhachHang(props.khachHang._id, form.value);
    } else {
      await store.createKhachHang(form.value);
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
.form-input, .form-select, select, input[type="number"], input[type="datetime-local"] {
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
.form-input:focus, .form-select:focus, select:focus, input[type="number"]:focus, input[type="datetime-local"]:focus {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99,102,241,0.13);
}
.form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.btn {
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
.btn:hover {
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
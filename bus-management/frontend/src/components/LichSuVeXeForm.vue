<template>
  <div class="modal fade" :id="modalId" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content rounded-lg shadow-light animate-scale-in">
        <div class="modal-header">
          <h5 class="modal-title text-gradient">{{ isEdit ? 'Sửa lịch sử vé xe' : 'Tạo lịch sử vé xe' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Vé xe</label>
              <select v-model="form.veXeId" class="form-input" required>
                <option value="">Chọn vé xe</option>
                <option v-for="veXe in veXes" :key="veXe._id" :value="veXe._id">
                  {{ veXe.maSoGhe }} - {{ veXe.khachHangId?.hoVaTen }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Hành động</label>
              <select v-model="form.hanhDong" class="form-input" required>
                <option value="">Chọn hành động</option>
                <option value="Tạo vé">Tạo vé</option>
                <option value="Cập nhật vé">Cập nhật vé</option>
                <option value="Hủy vé">Hủy vé</option>
                <option value="Hoàn tiền">Hoàn tiền</option>
                <option value="Thay đổi ghế">Thay đổi ghế</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea v-model="form.moTa" class="form-input" rows="3" required maxlength="300"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày thực hiện</label>
              <input v-model="form.ngayThucHien" type="datetime-local" class="form-input" required />
            </div>
            <button type="submit" class="btn bg-gradient w-100 mt-2 text-light fw-bold">{{ isEdit ? 'Cập nhật' : 'Tạo mới' }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useLichSuVeXeStore } from '../stores/lichSuVeXe';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { Modal } from 'bootstrap';

const props = defineProps({
  lichSuVeXe: Object,
  modalId: { type: String, required: true },
});
const emit = defineEmits(['saved']);

const store = useLichSuVeXeStore();
const toast = useToast();
const isEdit = !!props.lichSuVeXe?._id;
const form = ref({
  veXeId: '',
  hanhDong: '',
  moTa: '',
  ngayThucHien: '',
});

const veXes = ref([]);

watch(
  () => props.lichSuVeXe,
  (newLichSu) => {
    if (newLichSu) {
      form.value = {
        veXeId: newLichSu.veXeId._id,
        hanhDong: newLichSu.hanhDong,
        moTa: newLichSu.moTa,
        ngayThucHien: new Date(newLichSu.ngayThucHien).toISOString().slice(0, 16),
      };
    }
  },
  { immediate: true }
);

const fetchVeXes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vexe`);
    veXes.value = response.data.data;
  } catch (error) {
    toast.error('Lỗi khi tải danh sách vé xe');
  }
};

const submitForm = async () => {
  try {
    if (isEdit) {
      await store.updateLichSuVeXe(props.lichSuVeXe._id, form.value);
    } else {
      await store.createLichSuVeXe(form.value);
    }
    const modal = Modal.getInstance(document.getElementById(props.modalId));
    modal.hide();
    emit('saved');
  } catch (error) {
    // Error is handled in store
  }
};

fetchVeXes();
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
.form-input, .form-select, select, input[type="number"], input[type="datetime-local"], textarea {
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
.form-input:focus, .form-select:focus, select:focus, input[type="number"]:focus, input[type="datetime-local"]:focus, textarea:focus {
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
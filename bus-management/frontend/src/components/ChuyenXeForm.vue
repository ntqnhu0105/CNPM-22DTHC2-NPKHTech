<template>
  <div class="modal fade" :id="modalId" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content rounded-lg shadow-light animate-scale-in">
        <div class="modal-header">
          <h5 class="modal-title text-gradient">{{ isEdit ? 'Sửa chuyến xe' : 'Tạo chuyến xe' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Tuyến xe</label>
              <select v-model="form.tuyenXeId" class="form-input" required>
                <option v-for="tuyenXe in tuyenXes" :key="tuyenXe._id" :value="tuyenXe._id">
                  {{ tuyenXe.diemDi }} - {{ tuyenXe.diemDen }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Xe</label>
              <select v-model="form.xeId" class="form-input" required>
                <option v-for="xe in xes" :key="xe._id" :value="xe._id">{{ xe.bienSoXe }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Tài xế</label>
              <select v-model="form.taiXeId" class="form-input" required>
                <option v-for="taiXe in taiXes" :key="taiXe._id" :value="taiXe._id">{{ taiXe.hoVaTen }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Giá (VNĐ)</label>
              <input v-model.number="form.gia" type="number" class="form-input" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Thời gian khởi hành</label>
              <input v-model="form.thoiGianKhoiHanh" type="datetime-local" class="form-input" required />
            </div>
            <div class="mb-3" v-if="isEdit">
              <label class="form-label">Trạng thái</label>
              <select v-model="form.trangThaiChuyen" class="form-input">
                <option v-for="status in ['Pending', 'Running', 'Completed', 'Cancelled']" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
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
import { useChuyenXeStore } from '../stores/chuyenXe';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { Modal } from 'bootstrap';

const props = defineProps({
  chuyenXe: Object,
  modalId: { type: String, required: true },
});
const emit = defineEmits(['saved']);

const store = useChuyenXeStore();
const toast = useToast();
const isEdit = !!props.chuyenXe?._id;
const form = ref({
  tuyenXeId: '',
  xeId: '',
  taiXeId: '',
  gia: 0,
  thoiGianKhoiHanh: '',
  trangThaiChuyen: 'Pending',
});
const tuyenXes = ref([]);
const xes = ref([]);
const taiXes = ref([]);

watch(
  () => props.chuyenXe,
  (newChuyenXe) => {
    if (newChuyenXe) {
      form.value = {
        tuyenXeId: newChuyenXe.tuyenXeId._id,
        xeId: newChuyenXe.xeId._id,
        taiXeId: newChuyenXe.taiXeId._id,
        gia: newChuyenXe.gia,
        thoiGianKhoiHanh: new Date(newChuyenXe.thoiGianKhoiHanh).toISOString().slice(0, 16),
        trangThaiChuyen: newChuyenXe.trangThaiChuyen,
      };
    }
  },
  { immediate: true }
);

const fetchData = async () => {
  try {
    const [tuyenXeRes, xeRes, taiXeRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/tuyenxe`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/xe`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/taixe`),
    ]);
    tuyenXes.value = tuyenXeRes.data.data;
    xes.value = xeRes.data.data;
    taiXes.value = taiXeRes.data.data;
  } catch (error) {
    toast.error('Lỗi khi tải dữ liệu');
  }
};

const submitForm = async () => {
  try {
    if (isEdit) {
      await store.updateChuyenXe(props.chuyenXe._id, form.value);
    } else {
      await store.createChuyenXe(form.value);
    }
    const modal = Modal.getInstance(document.getElementById(props.modalId));
    modal.hide();
    emit('saved');
  } catch (error) {
    // Error is handled in store
  }
};

fetchData();
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
<template>
  <div class="modal fade" :id="modalId" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? 'Sửa chuyến xe' : 'Tạo chuyến xe' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Tuyến xe</label>
              <select v-model="form.tuyenXeId" class="form-control" required>
                <option v-for="tuyenXe in tuyenXes" :key="tuyenXe._id" :value="tuyenXe._id">
                  {{ tuyenXe.diemDi }} - {{ tuyenXe.diemDen }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Xe</label>
              <select v-model="form.xeId" class="form-control" required>
                <option v-for="xe in xes" :key="xe._id" :value="xe._id">{{ xe.bienSoXe }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Tài xế</label>
              <select v-model="form.taiXeId" class="form-control" required>
                <option v-for="taiXe in taiXes" :key="taiXe._id" :value="taiXe._id">{{ taiXe.hoVaTen }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Giá (VNĐ)</label>
              <input v-model.number="form.gia" type="number" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Thời gian khởi hành</label>
              <input v-model="form.thoiGianKhoiHanh" type="datetime-local" class="form-control" required />
            </div>
            <div class="mb-3" v-if="isEdit">
              <label class="form-label">Trạng thái</label>
              <select v-model="form.trangThaiChuyen" class="form-control">
                <option v-for="status in ['Pending', 'Running', 'Completed', 'Cancelled']" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Lưu</button>
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
<template>
  <div class="modal fade" :id="modalId" tabindex="-1">
    <div class="modal-dialog">
      <div class.bind="$attrs" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? 'Sửa nhân viên' : 'Tạo nhân viên' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">CCCD <span class="text-danger">*</span></label>
              <input v-model="form.cccd" type="text" class="form-control" required maxlength="12" pattern="[0-9]{12}" />
              <div class="form-text">CCCD phải có đúng 12 chữ số</div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
              <input v-model="form.hoVaTen" type="text" class="form-control" required maxlength="50" />
            </div>
            
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" maxlength="50" />
            </div>
            
            <div class="mb-3">
              <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
              <input v-model="form.sdt" type="text" class="form-control" required maxlength="11" pattern="[0-9]{10,11}" />
              <div class="form-text">Số điện thoại phải có 10 hoặc 11 chữ số</div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Địa chỉ</label>
              <input v-model="form.diaChi" type="text" class="form-control" maxlength="100" />
            </div>
            
            <div class="mb-3">
              <label class="form-label">Ngày sinh</label>
              <input v-model="form.ngaySinh" type="date" class="form-control" />
            </div>
            
            <div class="mb-3">
              <label class="form-label">Nhà xe <span class="text-danger">*</span></label>
              <select v-model="form.nhaXeId" class="form-select" required>
                <option value="" disabled>Chọn nhà xe</option>
                <option v-for="nhaXe in nhaXes" :key="nhaXe._id" :value="nhaXe._id">
                  {{ nhaXe.tenNhaXe }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Chức vụ <span class="text-danger">*</span></label>
              <select v-model="form.chucVu" class="form-select" required>
                <option disabled value="">Vui lòng chọn chức vụ</option>
                <option>Quản lý</option>
                <option>Tài xế</option>
                <option>Phụ xe</option>
                <option>Nhân viên bán vé</option>
              </select>
            </div>
            
            <div v-if="!isEdit">
              <div class="mb-3">
                <label class="form-label">Tên đăng nhập <span class="text-danger">*</span></label>
                <input v-model="form.username" type="text" class="form-control" required maxlength="50" />
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu <span class="text-danger">*</span></label>
                <input v-model="form.password" type="password" class="form-control" required minlength="6" />
                <div class="form-text">Mật khẩu phải có ít nhất 6 ký tự</div>
              </div>
            </div>
            
            <div class="text-end">
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useNhanVienStore } from '../stores/nhanVien';
import { Modal } from 'bootstrap';
import axios from 'axios';

const props = defineProps({
  nhanVien: Object,
  modalId: { type: String, required: true },
});
const emit = defineEmits(['saved']);

const store = useNhanVienStore();
const isEdit = computed(() => !!props.nhanVien?._id);

const form = ref({
  hoVaTen: '',
  sdt: '',
  chucVu: 'Nhân viên bán vé',
  username: '',
  password: '',
  cccd: '',
  email: '',
  diaChi: '',
  ngaySinh: '',
  nhaXeId: '',
});

const nhaXes = ref([]);

// Fetch danh sách nhà xe
const fetchNhaXes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/nhaxe`);
    nhaXes.value = response.data.data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách nhà xe:', error);
  }
};

watch(
  () => props.nhanVien,
  (newNhanVien) => {
    if (newNhanVien) {
      form.value = {
        hoVaTen: newNhanVien.hoVaTen,
        sdt: newNhanVien.sdt,
        chucVu: newNhanVien.chucVu,
        username: newNhanVien.userId?.username || '',
        password: '',
        cccd: newNhanVien.cccd || '',
        email: newNhanVien.email || '',
        diaChi: newNhanVien.diaChi || '',
        ngaySinh: newNhanVien.ngaySinh ? new Date(newNhanVien.ngaySinh).toISOString().split('T')[0] : '',
        nhaXeId: newNhanVien.nhaXeId || '',
      };
    } else {
      form.value = {
        hoVaTen: '',
        sdt: '',
        chucVu: 'Nhân viên bán vé',
        username: '',
        password: '',
        cccd: '',
        email: '',
        diaChi: '',
        ngaySinh: '',
        nhaXeId: '',
      };
    }
  },
  { immediate: true, deep: true }
);

const submitForm = async () => {
  try {
    if (isEdit.value) {
      const { hoVaTen, sdt, chucVu, cccd, email, diaChi, ngaySinh, nhaXeId } = form.value;
      await store.updateNhanVien(props.nhanVien._id, { 
        hoVaTen, sdt, chucVu, cccd, email, diaChi, ngaySinh, nhaXeId 
      });
    } else {
      await store.createNhanVien(form.value);
    }
    const modal = Modal.getInstance(document.getElementById(props.modalId));
    modal.hide();
    emit('saved');
  } catch (error) {
    // Error is handled in store
  }
};

onMounted(() => {
  fetchNhaXes();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
.modal-content {
  padding: 0 !important;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  background: #1A202C;
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
.form-control, .form-select {
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
.form-control:focus, .form-select:focus {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99,102,241,0.13);
}
.form-control::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.form-text {
  color: #9ca3af;
  font-size: 0.85rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
.btn {
  border-radius: 0.7rem;
  padding: 0.7rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn-primary {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  border: none;
  color: #fff;
}
.btn-primary:hover {
  background: linear-gradient(90deg, #5a5fd8 0%, #4f8fd8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #dde6ed;
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}
.text-danger {
  color: #ef4444 !important;
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
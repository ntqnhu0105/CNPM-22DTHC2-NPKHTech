<template>
  <div class="modal fade" :id="modalId" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? 'Sửa vé xe' : 'Tạo vé xe' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <!-- Debug info -->
          <div v-if="isDev" class="alert alert-info mb-3">
            <strong>Thông tin tổng:</strong><br>
            Nhân viên: {{ nhanViens.length }}<br>
            Chuyến xe: {{ chuyenXes.length }}<br>
            Khách hàng: {{ khachHangs.length }}<br>
            Xe: {{ xes.length }}<br>
            Khuyến mãi: {{ khuyenMais.length }}
          </div>
          
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Nhân viên</label>
                  <select v-model="form.nhanVienId" class="form-control" required>
                    <option value="">Chọn nhân viên</option>
                    <option v-for="nhanVien in nhanViens" :key="nhanVien._id" :value="nhanVien._id">
                      {{ nhanVien.hoVaTen }}
                    </option>
                  </select>
                  <small class="text-muted">Có {{ nhanViens.length }} nhân viên</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Chuyến xe</label>
                  <select v-model="form.chuyenXeId" class="form-control" required>
                    <option value="">Chọn chuyến xe</option>
                    <option v-for="chuyenXe in chuyenXes" :key="chuyenXe._id" :value="chuyenXe._id">
                      {{ chuyenXe.tuyenXeId?.diemDi || 'N/A' }} - {{ chuyenXe.tuyenXeId?.diemDen || 'N/A' }} 
                      ({{ chuyenXe.thoiGianKhoiHanh ? new Date(chuyenXe.thoiGianKhoiHanh).toLocaleString('vi-VN') : 'N/A' }})
                    </option>
                  </select>
                  <small class="text-muted">Có {{ chuyenXes.length }} chuyến xe</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Khách hàng</label>
                  <select v-model="form.khachHangId" class="form-control" required>
                    <option value="">Chọn khách hàng</option>
                    <option v-for="khachHang in khachHangs" :key="khachHang._id" :value="khachHang._id">
                      {{ khachHang.hoVaTen }} - {{ khachHang.sdt }}
                    </option>
                  </select>
                  <small class="text-muted">Có {{ khachHangs.length }} khách hàng</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mã số ghế</label>
                  <input v-model="form.maSoGhe" type="text" class="form-control" required maxlength="10" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Xe</label>
                  <select v-model="form.xeId" class="form-control" required>
                    <option value="">Chọn xe</option>
                    <option v-for="xe in xes" :key="xe._id" :value="xe._id">
                      {{ xe.bienSoXe }} - {{ xe.loaiXeId?.tenLoai || 'N/A' }}
                    </option>
                  </select>
                  <small class="text-muted">Có {{ xes.length }} xe</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Ngày đặt vé</label>
                  <input v-model="form.ngayDatVe" type="datetime-local" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Khuyến mãi</label>
                  <select v-model="form.khuyenMaiId" class="form-control">
                    <option value="">Không có khuyến mãi</option>
                    <option v-for="khuyenMai in khuyenMais" :key="khuyenMai._id" :value="khuyenMai._id">
                      {{ khuyenMai.tenKhuyenMai }} ({{ khuyenMai.phanTramGiamGia }}%)
                    </option>
                  </select>
                  <small class="text-muted">Có {{ khuyenMais.length }} khuyến mãi</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Tổng tiền (VNĐ)</label>
                  <input v-model.number="form.tongTien" type="number" class="form-control" required />
                </div>
                <div class="mb-3" v-if="isEdit">
                  <label class="form-label">Trạng thái</label>
                  <select v-model="form.trangThai" class="form-control">
                    <option value="Booked">Đã đặt</option>
                    <option value="Paid">Đã thanh toán</option>
                    <option value="Cancelled">Đã hủy</option>
                    <option value="Refunded">Đã hoàn tiền</option>
                  </select>
                </div>
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
import { useVeXeStore } from '../stores/veXe';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { Modal } from 'bootstrap';

const props = defineProps({
  veXe: Object,
  modalId: { type: String, required: true },
});
const emit = defineEmits(['saved']);

const store = useVeXeStore();
const toast = useToast();
const isEdit = computed(() => !!props.veXe?._id);
const isDev = computed(() => import.meta.env.DEV);

const form = ref({
  nhanVienId: '',
  chuyenXeId: '',
  khachHangId: '',
  maSoGhe: '',
  xeId: '',
  ngayDatVe: '',
  khuyenMaiId: '',
  tongTien: 0,
  trangThai: 'Booked',
});

const nhanViens = ref([]);
const chuyenXes = ref([]);
const khachHangs = ref([]);
const xes = ref([]);
const khuyenMais = ref([]);

// Fetch data for dropdowns
const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('Fetching data for dropdowns...');
    
    const [nhanVienRes, chuyenXeRes, khachHangRes, xeRes, khuyenMaiRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/nhanvien`, { headers }),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/chuyenxe`, { headers }),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/khachhang`, { headers }),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/xe`, { headers }),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/khuyenmai`, { headers }),
    ]);
    
    console.log('API Responses:', {
      nhanVien: nhanVienRes.data,
      chuyenXe: chuyenXeRes.data,
      khachHang: khachHangRes.data,
      xe: xeRes.data,
      khuyenMai: khuyenMaiRes.data
    });
    
    // Handle different response formats
    nhanViens.value = nhanVienRes.data.data || nhanVienRes.data || [];
    chuyenXes.value = chuyenXeRes.data.data || chuyenXeRes.data || [];
    khachHangs.value = khachHangRes.data.data || khachHangRes.data || [];
    xes.value = xeRes.data.data || xeRes.data || [];
    khuyenMais.value = khuyenMaiRes.data.data || khuyenMaiRes.data || [];
    
    console.log('Processed data:', {
      nhanViens: nhanViens.value.length,
      chuyenXes: chuyenXes.value.length,
      khachHangs: khachHangs.value.length,
      xes: xes.value.length,
      khuyenMais: khuyenMais.value.length
    });
    
  } catch (error) {
    console.error('Error fetching data:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      toast.error('Bạn không có quyền truy cập dữ liệu này.');
    } else {
      toast.error(`Lỗi khi tải dữ liệu: ${error.response?.data?.message || error.message}`);
    }
  }
};

watch(
  () => props.veXe,
  (newVeXe) => {
    if (newVeXe) {
      form.value = {
        nhanVienId: newVeXe.nhanVienId?._id || '',
        chuyenXeId: newVeXe.chuyenXeId?._id || '',
        khachHangId: newVeXe.khachHangId?._id || '',
        maSoGhe: newVeXe.maSoGhe || '',
        xeId: newVeXe.xeId?._id || '',
        ngayDatVe: newVeXe.ngayDatVe ? new Date(newVeXe.ngayDatVe).toISOString().slice(0, 16) : '',
        khuyenMaiId: newVeXe.khuyenMaiId?._id || '',
        tongTien: newVeXe.tongTien || 0,
        trangThai: newVeXe.trangThai || 'Booked',
      };
    } else {
      form.value = {
        nhanVienId: '',
        chuyenXeId: '',
        khachHangId: '',
        maSoGhe: '',
        xeId: '',
        ngayDatVe: '',
        khuyenMaiId: '',
        tongTien: 0,
        trangThai: 'Booked',
      };
    }
  },
  { immediate: true, deep: true }
);

const submitForm = async () => {
  try {
    if (isEdit.value) {
      await store.updateVeXe(props.veXe._id, form.value);
    } else {
      await store.createVeXe(form.value);
    }
    const modal = Modal.getInstance(document.getElementById(props.modalId));
    modal.hide();
    emit('saved');
  } catch (error) {
    // Error is handled in store
  }
};

onMounted(() => {
  fetchData();
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
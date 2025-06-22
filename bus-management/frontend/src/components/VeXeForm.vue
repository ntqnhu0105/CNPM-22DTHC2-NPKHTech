<template>
  <div class="modal fade" :id="modalId" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? 'Sửa vé xe' : 'Tạo vé xe' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
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
                </div>
                <div class="mb-3">
                  <label class="form-label">Chuyến xe</label>
                  <select v-model="form.chuyenXeId" class="form-control" required>
                    <option value="">Chọn chuyến xe</option>
                    <option v-for="chuyenXe in chuyenXes" :key="chuyenXe._id" :value="chuyenXe._id">
                      {{ chuyenXe.tuyenXeId?.diemDi }} - {{ chuyenXe.tuyenXeId?.diemDen }} ({{ new Date(chuyenXe.thoiGianKhoiHanh).toLocaleString('vi-VN') }})
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Khách hàng</label>
                  <select v-model="form.khachHangId" class="form-control" required>
                    <option value="">Chọn khách hàng</option>
                    <option v-for="khachHang in khachHangs" :key="khachHang._id" :value="khachHang._id">
                      {{ khachHang.hoVaTen }} - {{ khachHang.sdt }}
                    </option>
                  </select>
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
                      {{ xe.bienSoXe }} - {{ xe.loaiXeId?.tenLoaiXe }}
                    </option>
                  </select>
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
import { ref, watch } from 'vue';
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
const isEdit = !!props.veXe?._id;
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

watch(
  () => props.veXe,
  (newVeXe) => {
    if (newVeXe) {
      form.value = {
        nhanVienId: newVeXe.nhanVienId._id,
        chuyenXeId: newVeXe.chuyenXeId._id,
        khachHangId: newVeXe.khachHangId._id,
        maSoGhe: newVeXe.maSoGhe,
        xeId: newVeXe.xeId._id,
        ngayDatVe: new Date(newVeXe.ngayDatVe).toISOString().slice(0, 16),
        khuyenMaiId: newVeXe.khuyenMaiId?._id || '',
        tongTien: newVeXe.tongTien,
        trangThai: newVeXe.trangThai,
      };
    }
  },
  { immediate: true }
);

const fetchData = async () => {
  try {
    const [nhanVienRes, chuyenXeRes, khachHangRes, xeRes, khuyenMaiRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/nhanvien`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/chuyenxe`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/khachhang`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/xe`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/khuyenmai`),
    ]);
    nhanViens.value = nhanVienRes.data.data;
    chuyenXes.value = chuyenXeRes.data.data;
    khachHangs.value = khachHangRes.data.data;
    xes.value = xeRes.data.data;
    khuyenMais.value = khuyenMaiRes.data.data;
  } catch (error) {
    toast.error('Lỗi khi tải dữ liệu');
  }
};

const submitForm = async () => {
  try {
    if (isEdit) {
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

fetchData();
</script> 
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
              <label class="form-label">Họ và tên</label>
              <input v-model="form.hoVaTen" type="text" class="form-control" required />
            </div>
            
            <div v-if="!isEdit">
              <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input v-model="form.username" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input v-model="form.password" type="password" class="form-control" required />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Số điện thoại</label>
              <input v-model="form.sdt" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Chức vụ</label>
              <select v-model="form.chucVu" class="form-select" required>
                <option disabled value="">Vui lòng chọn chức vụ</option>
                <option>Quản lý</option>
                <option>Tài xế</option>
                <option>Phụ xe</option>
                <option>Nhân viên bán vé</option>
              </select>
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
import { ref, watch, computed } from 'vue';
import { useNhanVienStore } from '../stores/nhanVien';
import { Modal } from 'bootstrap';

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
});

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
      };
    } else {
      form.value = {
        hoVaTen: '',
        sdt: '',
        chucVu: 'Nhân viên bán vé',
        username: '',
        password: '',
      };
    }
  },
  { immediate: true, deep: true }
);

const submitForm = async () => {
  try {
    if (isEdit.value) {
      const { hoVaTen, sdt, chucVu } = form.value;
      await store.updateNhanVien(props.nhanVien._id, { hoVaTen, sdt, chucVu });
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
</script> 
<template>
  <DefaultLayout>
    <section class="tx-header">
      <div class="tx-header-left">
        <i class="bi bi-signpost-2-fill tx-header-icon"></i>
        <div>
          <h1 class="tx-title">Quản lý tuyến xe</h1>
          <p class="tx-desc">Tạo, chỉnh sửa và quản lý tuyến xe dễ dàng.</p>
        </div>
      </div>
      <button class="tx-btn" data-bs-toggle="modal" data-bs-target="#createModal">
        <i class="bi bi-plus-lg"></i>
        <span>Tạo tuyến xe</span>
      </button>
    </section>
    <section class="tx-content-card">
      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-else class="table-responsive">
        <table class="table tx-table mb-0">
          <thead>
            <tr>
              <th class="highlight-text">Điểm đi</th>
              <th class="highlight-text">Điểm đến</th>
              <th class="highlight-text">Khoảng cách (km)</th>
              <th class="highlight-text">Thời gian dự kiến</th>
              <th class="highlight-text">Mô tả</th>
              <th class="text-center highlight-text">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tuyenXe in store.tuyenXes" :key="tuyenXe._id" class="table-row-hover">
              <td>{{ tuyenXe.diemDi }}</td>
              <td>{{ tuyenXe.diemDen }}</td>
              <td>{{ tuyenXe.khoangCach || '-' }}</td>
              <td>{{ tuyenXe.thoiGianDuKien || '-' }}</td>
              <td>{{ tuyenXe.moTa || '-' }}</td>
              <td class="action-buttons text-center">
                <button class="action-btn text-edit-btn me-2" @click="openEditModal(tuyenXe)">Sửa</button>
                <button class="action-btn text-delete-btn" @click="store.deleteTuyenXe(tuyenXe._id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <nav class="mt-4">
          <ul class="pagination justify-content-center tx-pagination">
            <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
              <a class="page-link" @click="store.fetchTuyenXes(store.pagination.page - 1)"><i class="bi bi-chevron-left"></i> Trước</a>
            </li>
            <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
              <a class="page-link" @click="store.fetchTuyenXes(n)">{{ n }}</a>
            </li>
            <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
              <a class="page-link" @click="store.fetchTuyenXes(store.pagination.page + 1)">Sau <i class="bi bi-chevron-right"></i></a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Modal tạo tuyến xe -->
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content tx-modal-content">
            <div class="modal-header tx-modal-header">
              <h5 class="modal-title tx-modal-title">Tạo tuyến xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body tx-modal-body">
              <form @submit.prevent="store.createTuyenXe(form)">
                <div class="mb-3">
                  <label class="tx-form-label">Điểm đi</label>
                  <input v-model="form.diemDi" type="text" class="tx-form-input" required placeholder="Nhập điểm đi" />
                </div>
                <div class="mb-3">
                  <label class="tx-form-label">Điểm đến</label>
                  <input v-model="form.diemDen" type="text" class="tx-form-input" required placeholder="Nhập điểm đến" />
                </div>
                <div class="mb-3">
                  <label class="tx-form-label">Khoảng cách (km)</label>
                  <input v-model.number="form.khoangCach" type="number" class="tx-form-input" placeholder="Nhập khoảng cách" />
                </div>
                <div class="mb-3">
                  <label class="tx-form-label">Thời gian dự kiến</label>
                  <input v-model="form.thoiGianDuKien" type="text" class="tx-form-input" placeholder="Nhập thời gian dự kiến" />
                </div>
                <div class="mb-3">
                  <label class="tx-form-label">Mô tả</label>
                  <textarea v-model="form.moTa" class="tx-form-input" maxlength="200" placeholder="Mô tả tuyến xe (tối đa 200 ký tự)"></textarea>
                </div>
                <button type="submit" class="tx-btn-submit">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal sửa tuyến xe -->
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content tx-modal-content">
            <div class="modal-header tx-modal-header">
              <h5 class="modal-title tx-modal-title">Sửa tuyến xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body tx-modal-body">
              <form @submit.prevent="store.updateTuyenXe(selectedTuyenXe._id, form)">
                <div class="mb-3">
                  <label class="tx-form-label">Điểm đi</label>
                  <input v-model="form.diemDi" type="text" class="tx-form-input" required placeholder="Nhập điểm đi" />
                </div>
                <div class="mb-3">
                  <label class="tx-form-label">Điểm đến</label>
                  <input v-model="form.diemDen" type="text" class="tx-form-input" required placeholder="Nhập điểm đến" />
                </div>
                <div class="mb-3">
                  <label class="tx-form-label">Khoảng cách (km)</label>
                  <input v-model.number="form.khoangCach" type="number" class="tx-form-input" placeholder="Nhập khoảng cách" />
                </div>
                <div class="mb-3">
                  <label class="tx-form-label">Thời gian dự kiến</label>
                  <input v-model="form.thoiGianDuKien" type="text" class="tx-form-input" placeholder="Nhập thời gian dự kiến" />
                </div>
                <div class="mb-3">
                  <label class="tx-form-label">Mô tả</label>
                  <textarea v-model="form.moTa" class="tx-form-input" maxlength="200" placeholder="Mô tả tuyến xe (tối đa 200 ký tự)"></textarea>
                </div>
                <button type="submit" class="tx-btn-submit">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useTuyenXeStore } from '../stores/tuyenXe';
import { Modal } from 'bootstrap';

const store = useTuyenXeStore();
const form = ref({ diemDi: '', diemDen: '', khoangCach: null, thoiGianDuKien: '', moTa: '' });
const selectedTuyenXe = ref(null);

store.fetchTuyenXes();

const openEditModal = (tuyenXe) => {
  selectedTuyenXe.value = tuyenXe;
  form.value = { ...tuyenXe };
  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
body {
  font-family: 'Inter', sans-serif;
  background: #1A202C;
  color: #dde6ed;
}
.tx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.tx-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.tx-header-icon {
  font-size: 2.2rem;
  color: #6366f1;
  background: #fdfdfd;
  border-radius: 50%;
  padding: 0.7rem;
}
.tx-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.tx-desc {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
}
.tx-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1A202C;
  color: #fff;
  border: 1.5px solid #ffffff;
  border-radius: 0.7rem;
  padding: 0.7rem 1.4rem;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.tx-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.tx-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
.tx-table {
  border-radius: 1.2rem;
  overflow: hidden;
  background: #1A202C;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.05);
}
.tx-table thead tr {
  background: linear-gradient(90deg, #5a5fcc 0%, #5190e0 100%);
}
.tx-table th {
  color: #050505;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  padding: 1.1rem 1rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  vertical-align: middle;
}
.highlight-text {
  color: #DDE6ED;
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.3);
}
.tx-table td {
  vertical-align: middle;
  font-size: 0.98rem;
  border-color: #2D3748;
  padding: 1rem 1rem;
  background: transparent;
  color: #dde6ed;
}
.table-row-hover:hover {
  background: #232936 !important;
  transition: background 0.2s ease-in-out;
}
.action-buttons {
  white-space: nowrap;
}
.action-btn {
  border-radius: 0.5rem;
  padding: 0.6em 1.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.text-edit-btn {
  background: #232946;
  color: #60A5FA;
  border: 1px solid #363b53;
}
.text-edit-btn:hover {
  background: #2d3650;
  color: #a5b4fc;
}
.text-delete-btn {
  background: #3b1d1d;
  color: #EF4444;
  border: 1px solid #5a2e2e;
}
.text-delete-btn:hover {
  background: #7f1d1d;
  color: #fee2e2;
}
.tx-pagination .page-item .page-link {
  border-radius: 0.75rem !important;
  margin: 0 0.25em;
  color: #eeeef1;
  font-weight: 600;
  background: #1A202C;
  border: 1.5px solid #363b53;
  transition: all 0.2s ease;
  padding: 0.6em 1em;
  min-width: 2.5em;
  text-align: center;
}
.tx-pagination .page-item.active .page-link,
.tx-pagination .page-item .page-link:hover {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
}
.tx-pagination .page-item.disabled .page-link {
  background: #1A202C;
  color: #6b7280;
  border-color: #2D3748;
  cursor: not-allowed;
  opacity: 0.6; 
}
/* Modal Styling */
.tx-modal-content {
  padding: 0 !important;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  background: #1A202C;
  border: 1.5px solid #363b53;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
}
.tx-modal-header {
  padding: 1.1rem 1.7rem 0.7rem 1.7rem !important;
  background: #1A202C;
  border-bottom: 1px solid #363b53;
  border-top-left-radius: 1.2rem;
  border-top-right-radius: 1.2rem;
}
.tx-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #a5b4fc;
  letter-spacing: -0.01em;
}
.btn-close {
  filter: invert(1) grayscale(1);
  opacity: 0.7;
}
.tx-modal-body {
  padding: 1.2rem 1.7rem !important;
  max-height: 70vh;
  overflow-y: auto;
}
.tx-form-label {
  color: #dde6ed;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 1rem;
}
.tx-form-input {
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
.tx-form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99,102,241,0.13);
}
.tx-form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.tx-btn-submit {
  width: 100%;
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
.tx-btn-submit:hover {
  background: #4f46e5;
  color: #fff;
}
@media (max-width: 768px) {
  .tx-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .tx-header-left { gap: 0.7rem; }
  .tx-title { font-size: 1.3rem; }
  .tx-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .tx-content-card { padding: 1rem 0.5rem; }
  .tx-modal-header, .tx-modal-body { padding: 0.7rem 0.7rem !important; }
  .tx-modal-content { border-radius: 0.7rem; }
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
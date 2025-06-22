<template>
  <DefaultLayout>
    <section class="nhx-header">
      <div class="nhx-header-left">
        <i class="bi bi-building nhx-header-icon"></i>
        <div>
          <h1 class="nhx-title">Quản lý nhà xe</h1>
          <p class="nhx-desc">Tạo, chỉnh sửa và quản lý nhà xe dễ dàng.</p>
        </div>
      </div>
      <button
        class="nhx-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        v-tooltip="'Tạo nhà xe mới'"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm nhà xe</span>
      </button>
    </section>
    <section class="nhx-content-card">
      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-else class="table-responsive">
        <table class="table nhx-table mb-0">
          <thead>
            <tr>
              <th class="highlight-text">Tên nhà xe</th>
              <th class="highlight-text">Địa chỉ</th>
              <th class="highlight-text">Email</th>
              <th class="highlight-text">SĐT</th>
              <th class="text-center highlight-text">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nhaXe in store.nhaXes" :key="nhaXe._id" class="table-row-hover">
              <td>{{ nhaXe.tenNhaXe }}</td>
              <td>{{ nhaXe.diaChi }}</td>
              <td>{{ nhaXe.email }}</td>
              <td>{{ nhaXe.sdt }}</td>
              <td class="action-buttons text-center">
                <button class="action-btn text-edit-btn me-2" @click="openEditModal(nhaXe)" v-tooltip="'Sửa nhà xe'">Sửa</button>
                <button class="action-btn text-delete-btn" @click="store.deleteNhaXe(nhaXe._id)" v-tooltip="'Xóa nhà xe'">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <nav class="mt-4">
          <ul class="pagination justify-content-center nhx-pagination">
            <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
              <a class="page-link" @click="store.fetchNhaXes(store.pagination.page - 1)"><i class="bi bi-chevron-left"></i> Trước</a>
            </li>
            <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
              <a class="page-link" @click="store.fetchNhaXes(n)">{{ n }}</a>
            </li>
            <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
              <a class="page-link" @click="store.fetchNhaXes(store.pagination.page + 1)">Sau <i class="bi bi-chevron-right"></i></a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Create Modal -->
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content nhx-modal-content">
            <div class="modal-header nhx-modal-header">
              <h5 class="modal-title nhx-modal-title">Tạo nhà xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body nhx-modal-body">
              <form @submit.prevent="store.createNhaXe(form)">
                <div class="mb-3">
                  <label class="nhx-form-label">Tên nhà xe</label>
                  <input v-model="form.tenNhaXe" type="text" class="nhx-form-input" required />
                </div>
                <div class="mb-3">
                  <label class="nhx-form-label">Địa chỉ</label>
                  <input v-model="form.diaChi" type="text" class="nhx-form-input" required />
                </div>
                <div class="mb-3">
                  <label class="nhx-form-label">Email</label>
                  <input v-model="form.email" type="email" class="nhx-form-input" required />
                </div>
                <div class="mb-3">
                  <label class="nhx-form-label">SĐT</label>
                  <input v-model="form.sdt" type="text" class="nhx-form-input" pattern="[0-9]{10,11}" required />
                </div>
                <button type="submit" class="nhx-btn-submit">Lưu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Edit Modal -->
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content nhx-modal-content">
            <div class="modal-header nhx-modal-header">
              <h5 class="modal-title nhx-modal-title">Sửa nhà xe</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
            </div>
            <div class="modal-body nhx-modal-body">
              <form @submit.prevent="store.updateNhaXe(selectedNhaXe._id, form)">
                <div class="mb-3">
                  <label class="nhx-form-label">Tên nhà xe</label>
                  <input v-model="form.tenNhaXe" type="text" class="nhx-form-input" required />
                </div>
                <div class="mb-3">
                  <label class="nhx-form-label">Địa chỉ</label>
                  <input v-model="form.diaChi" type="text" class="nhx-form-input" required />
                </div>
                <div class="mb-3">
                  <label class="nhx-form-label">Email</label>
                  <input v-model="form.email" type="email" class="nhx-form-input" required />
                </div>
                <div class="mb-3">
                  <label class="nhx-form-label">SĐT</label>
                  <input v-model="form.sdt" type="text" class="nhx-form-input" pattern="[0-9]{10,11}" required />
                </div>
                <button type="submit" class="nhx-btn-submit">Lưu</button>
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
import { useNhaXeStore } from '../stores/nhaXe';
import { Modal } from 'bootstrap';

const store = useNhaXeStore();
const form = ref({ tenNhaXe: '', diaChi: '', email: '', sdt: '' });
const selectedNhaXe = ref(null);

store.fetchNhaXes();

const openEditModal = (nhaXe) => {
  selectedNhaXe.value = nhaXe;
  form.value = { ...nhaXe };
  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};

const resetForm = () => {
  form.value = { tenNhaXe: '', diaChi: '', email: '', sdt: '' };
  selectedNhaXe.value = null;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
body {
  font-family: 'Inter', sans-serif;
  background: #1A202C;
  color: #dde6ed;
}
.nhx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.nhx-header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.nhx-header-icon {
  font-size: 2.2rem;
  color: #3f3f3f;
  background: #ffffff;
  border-radius: 50%;
  padding: 0.7rem;
}
.nhx-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.nhx-desc {
  color: #9a9ea5;
  font-size: 1rem;
  margin: 0;
}
.nhx-btn {
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
.nhx-btn:hover {
  background: #0000004f;
  border-color: #6b6b6b;
}
.nhx-content-card {
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
.nhx-table {
  border-radius: 1.2rem;
  overflow: hidden;
  background: transparent;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.05);
}
.nhx-table thead tr {
  background: linear-gradient(90deg, #5a5fcc 0%, #5190e0 100%);
}
.nhx-table th {
  color: #1A202C;
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
.nhx-table td {
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
.nhx-pagination .page-item .page-link {
  border-radius: 0.75rem !important;
  margin: 0 0.25em;
  color: #6366f1;
  font-weight: 600;
  background: #232946;
  border: 1.5px solid #363b53;
  transition: all 0.2s ease;
  padding: 0.6em 1em;
  min-width: 2.5em;
  text-align: center;
}
.nhx-pagination .page-item.active .page-link,
.nhx-pagination .page-item .page-link:hover {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
}
.nhx-pagination .page-item.disabled .page-link {
  background: #1A202C;
  color: #6b7280;
  border-color: #2D3748;
  cursor: not-allowed;
  opacity: 0.6;
}
.nhx-modal-content {
  padding: 0 !important;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  background: #232946;
  border: 1.5px solid #363b53;
  color: #dde6ed;
  font-family: 'Inter', sans-serif;
}
.nhx-modal-header {
  padding: 1.1rem 1.7rem 0.7rem 1.7rem !important;
  background: #1A202C;
  border-bottom: 1px solid #363b53;
  border-top-left-radius: 1.2rem;
  border-top-right-radius: 1.2rem;
}
.nhx-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #a5b4fc;
  letter-spacing: -0.01em;
}
.btn-close {
  filter: invert(1) grayscale(1);
  opacity: 0.7;
}
.nhx-modal-body {
  padding: 1.2rem 1.7rem !important;
  max-height: 70vh;
  overflow-y: auto;
}
.nhx-form-label {
  color: #dde6ed;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 1rem;
}
.nhx-form-input {
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
.nhx-form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99,102,241,0.13);
}
.nhx-form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.nhx-btn-submit {
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
.nhx-btn-submit:hover {
  background: #4f46e5;
  color: #fff;
}
@media (max-width: 768px) {
  .nhx-header { flex-direction: column; align-items: flex-start; padding: 1.2rem 1rem; }
  .nhx-header-left { gap: 0.7rem; }
  .nhx-title { font-size: 1.3rem; }
  .nhx-btn { width: 100%; justify-content: center; margin-top: 1rem; }
  .nhx-content-card { padding: 1rem 0.5rem; }
  .nhx-modal-header, .nhx-modal-body { padding: 0.7rem 0.7rem !important; }
  .nhx-modal-content { border-radius: 0.7rem; }
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
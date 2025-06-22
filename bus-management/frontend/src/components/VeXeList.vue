<template>
  <div class="card">
    <div class="card-header">
      <h3>Danh sách vé xe</h3>
    </div>
    <div class="card-body">
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Chuyến xe</th>
            <th>Khách hàng</th>
            <th>Mã số ghế</th>
            <th>Xe</th>
            <th>Ngày đặt vé</th>
            <th>Khuyến mãi</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="veXe in store.veXes" :key="veXe._id">
            <td>{{ veXe.nhanVienId?.hoVaTen || 'N/A' }}</td>
            <td>{{ veXe.chuyenXeId?.tuyenXeId?.diemDi }} - {{ veXe.chuyenXeId?.tuyenXeId?.diemDen }}</td>
            <td>{{ veXe.khachHangId?.hoVaTen || 'N/A' }}</td>
            <td>{{ veXe.maSoGhe }}</td>
            <td>{{ veXe.xeId?.bienSoXe || 'N/A' }}</td>
            <td>{{ new Date(veXe.ngayDatVe).toLocaleString('vi-VN') }}</td>
            <td>{{ veXe.khuyenMaiId?.tenKhuyenMai || 'Không có' }}</td>
            <td>{{ veXe.tongTien.toLocaleString('vi-VN') }} VNĐ</td>
            <td>
              <span :class="getStatusClass(veXe.trangThai)">{{ veXe.trangThai }}</span>
            </td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="$emit('edit', veXe)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="store.deleteVeXe(veXe._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchVeXes(store.pagination.page - 1)">Trước</a>
          </li>
          <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
            <a class="page-link" @click="store.fetchVeXes(n)">{{ n }}</a>
          </li>
          <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
            <a class="page-link" @click="store.fetchVeXes(store.pagination.page + 1)">Sau</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useVeXeStore } from '../stores/veXe';

const store = useVeXeStore();

const getStatusClass = (status) => {
  switch (status) {
    case 'Booked': return 'badge bg-warning';
    case 'Paid': return 'badge bg-success';
    case 'Cancelled': return 'badge bg-danger';
    case 'Refunded': return 'badge bg-info';
    default: return 'badge bg-secondary';
  }
};

store.fetchVeXes();
</script> 
<template>
  <div class="card">
    <div class="card-header">
      <h3>Danh sách chuyến xe</h3>
    </div>
    <div class="card-body">
      <div v-if="store.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <table v-else class="table table-bordered">
        <thead>
          <tr>
            <th>Tuyến xe</th>
            <th>Xe</th>
            <th>Tài xế</th>
            <th>Giá</th>
            <th>Thời gian khởi hành</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chuyenXe in store.chuyenXes" :key="chuyenXe._id">
            <td>{{ chuyenXe.tuyenXeId.diemDi }} - {{ chuyenXe.tuyenXeId.diemDen }}</td>
            <td>{{ chuyenXe.xeId.bienSoXe }}</td>
            <td>{{ chuyenXe.taiXeId.hoVaTen }}</td>
            <td>{{ chuyenXe.gia.toLocaleString('vi-VN') }} VNĐ</td>
            <td>{{ new Date(chuyenXe.thoiGianKhoiHanh).toLocaleString('vi-VN') }}</td>
            <td>{{ chuyenXe.trangThaiChuyen }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="$emit('edit', chuyenXe)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="store.deleteChuyenXe(chuyenXe._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.pagination.page === 1 }">
            <a class="page-link" @click="store.fetchChuyenXes(store.pagination.page - 1)">Trước</a>
          </li>
          <li class="page-item" v-for="n in Math.ceil(store.pagination.total / store.pagination.limit)" :key="n" :class="{ active: n === store.pagination.page }">
            <a class="page-link" @click="store.fetchChuyenXes(n)">{{ n }}</a>
          </li>
          <li class="page-item" :class="{ disabled: store.pagination.page === Math.ceil(store.pagination.total / store.pagination.limit) }">
            <a class="page-link" @click="store.fetchChuyenXes(store.pagination.page + 1)">Sau</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useChuyenXeStore } from '../stores/chuyenXe';

const store = useChuyenXeStore();
store.fetchChuyenXes();
</script>
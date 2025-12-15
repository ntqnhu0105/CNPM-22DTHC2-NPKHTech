<template>
  <div class="modal fade" :id="id" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content rounded-lg shadow-light animate-scale-in">
        <div class="modal-header">
          <h5 class="modal-title text-gradient">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <slot></slot> </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['id', 'title']);
</script>

<style scoped>
/* Copy CSS Modal chung vào đây */
.modal-content { background: #232946; border: 1.5px solid #363b53; color: #dde6ed; }
.modal-header { background: #1A202C; border-bottom: 1px solid #363b53; }
.modal-title { color: #a5b4fc; font-weight: 700; }
.btn-close { filter: invert(1) grayscale(1); opacity: 0.7; }
</style>
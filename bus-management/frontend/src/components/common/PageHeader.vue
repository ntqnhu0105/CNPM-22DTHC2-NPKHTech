<template>
  <section class="page-header">
    <div class="header-left">
      <i :class="[icon, 'header-icon']"></i>
      <div>
        <h1 class="title">{{ title }}</h1>
        <p class="desc">{{ description }}</p>
      </div>
    </div>
    <button class="action-btn" @click="$emit('create')" v-tooltip="tooltip">
      <i class="bi bi-plus-lg"></i>
      <span>{{ btnText }}</span>
    </button>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  icon: String,
  btnText: String,
  tooltip: String
});
defineEmits(['create']);
</script>

<style scoped>
/* Copy CSS chung từ các file View cũ vào đây */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1A202C;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
}
.header-left { display: flex; align-items: center; gap: 1.2rem; }
.header-icon { font-size: 2.2rem; color: #3f3f3f; background: #ffffff; border-radius: 50%; padding: 0.7rem; }
.title { font-size: 2rem; font-weight: 700; color: #ffffff; margin-bottom: 0.2rem; }
.desc { color: #9a9ea5; font-size: 1rem; margin: 0; }
.action-btn {
  display: flex; align-items: center; gap: 0.5rem;
  background: #1A202C; color: #fff;
  border: 1.5px solid #ffffff; border-radius: 0.7rem;
  padding: 0.7rem 1.4rem; font-weight: 600;
  transition: all 0.2s;
}
.action-btn:hover { background: #0000004f; border-color: #6b6b6b; }
</style>
<template>
  <div class="default-layout-main">
    <Navbar />
    <main class="default-layout-content">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
</script>

<style>
.default-layout-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--footer-bg, #1A202C);
  color: var(--footer-text, #E2E8F0);
  font-family: 'Inter', sans-serif;
}
.default-layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  background: transparent;
  color: inherit;
}
</style>
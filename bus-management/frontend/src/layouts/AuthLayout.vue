<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="../assets/logo.png" alt="Logo" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          <slot name="title">Welcome back</slot>
        </h2>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
// Auth layout is simple, just provides the structure for login/register pages
</script> 
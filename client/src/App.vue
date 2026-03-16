<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/navbar.vue';
</script>

<template>
  <NavBar />
  <div class="app-main-container">
    <RouterView />
  </div>
</template>

<style scoped>
.app-main-container {
  padding-top: 44px;
  background: #181028;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>
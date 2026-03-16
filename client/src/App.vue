<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/navbar.vue';
</script>

<template>
  <NavBar />
  <div class="section has-background-dark" style="padding-top: 44px; min-height: 100vh; overflow-x: hidden;">
    <RouterView />
  </div>
</template>


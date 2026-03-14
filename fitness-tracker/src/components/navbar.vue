<template>
  <header class="navbar">
    <h1>Exercise Hub</h1>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/workouts">Workouts</RouterLink>
      <RouterLink to="/nutrition">Nutrition</RouterLink>
      <RouterLink to="/tracker">Tracker</RouterLink>
      <RouterLink to="/contact">Contact</RouterLink>
      <RouterLink to="/recreation">Recreated Website</RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.navbar {
  padding: 20px;
  background: #f5f5f5;
}

nav {
  margin-top: 10px;
}

nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #333;
}

nav a.router-link-active {
  font-weight: bold;
  color: #0077ff;
}
</style>
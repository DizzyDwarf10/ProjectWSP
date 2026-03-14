<template>
  <div class="workouts-page">
    <header>
      <h1>Workouts</h1>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/workouts">Workouts</RouterLink>
        <RouterLink to="/nutrition">Nutrition</RouterLink>
        <RouterLink to="/tracker">Tracker</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </nav>
    </header>

    <!-- Add your workouts content here -->
  </div>
</template>

<script setup lang="ts">
// No logic yet — this is where your component logic will go
</script>

<style scoped>
/* Paste your styles.css content here or keep global styles in a shared file */

header {
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
</style>
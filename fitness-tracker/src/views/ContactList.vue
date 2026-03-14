<template>
  <div class="contact-page">
    <header>
      <h1>Contact Us</h1>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/workouts">Workouts</RouterLink>
        <RouterLink to="/nutrition">Nutrition</RouterLink>
        <RouterLink to="/tracker">Tracker</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </nav>
    </header>

    <!-- Add your contact form or content here -->
  </div>
</template>

<script setup lang="ts">
// No logic yet, but this is where it will go
</script>

<style scoped>
/* Paste your styles.css content here, or import global styles */
header {
  padding: 20px;
}

nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #333;
}
</style>
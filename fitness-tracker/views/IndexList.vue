<template>
  <div class="home-page">
    <header>
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

    <main>
      <section>
        <h2>Welcome to Your Fitness Journey</h2>
        <p>Explore workouts, track your progress, and build healthy habits.</p>
      </section>
    </main>

    <footer>
      <p>© 2026 Exercise Hub</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
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

main {
  padding: 20px;
}

footer {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  background: #f5f5f5;
}
</style>
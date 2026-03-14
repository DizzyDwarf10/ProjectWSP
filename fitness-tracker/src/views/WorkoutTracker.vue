<template>
  <div class="tracker-page">
    <header>
      <h1>Workout Tracker</h1>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/workouts">Workouts</RouterLink>
        <RouterLink to="/nutrition">Nutrition</RouterLink>
        <RouterLink to="/tracker">Tracker</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </nav>
    </header>

    <main>
      <section>
        <h2>Log Your Workout</h2>

        <input
          v-model="exercise"
          type="text"
          placeholder="Exercise name"
        />

        <input
          v-model.number="reps"
          type="number"
          placeholder="Reps"
        />

        <button @click="addWorkout">Add</button>

        <ul>
          <li v-for="(item, index) in workouts" :key="index">
            {{ item.exercise }} — {{ item.reps }} reps
          </li>
        </ul>
      </section>
    </main>

    <footer>
      <p>© 2026 Exercise Hub</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const exercise = ref("");
const reps = ref<number | null>(null);

const workouts = ref<{ exercise: string; reps: number }[]>([]);

function addWorkout() {
  if (!exercise.value || !reps.value) return;

  workouts.value.push({
    exercise: exercise.value,
    reps: reps.value
  });

  exercise.value = "";
  reps.value = null;
}
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
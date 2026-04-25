<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <h1 class="title is-3 has-text-white has-text-centered mb-5">My Statistics</h1>

      <div v-if="!currentUser" class="notification is-warning has-text-centered">
        Please log in to view your statistics.
      </div>

      <div v-else-if="loading" class="has-text-centered has-text-white mt-6">
        <p>Loading...</p>
      </div>

      <template v-else>
        <!-- Summary Cards -->
        <div class="columns is-multiline is-centered mb-5">
          <div class="column is-3-desktop is-6-tablet">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Total Workouts</p>
              <p class="title has-text-white">{{ summary.totalActivities }}</p>
            </div>
          </div>
          <div class="column is-3-desktop is-6-tablet">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Total Minutes</p>
              <p class="title has-text-white">{{ summary.totalMinutes }}</p>
            </div>
          </div>
          <div class="column is-3-desktop is-6-tablet">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Total Distance (km)</p>
              <p class="title has-text-white">{{ summary.totalDistance.toFixed(1) }}</p>
            </div>
          </div>
          <div class="column is-3-desktop is-6-tablet">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Total Reps</p>
              <p class="title has-text-white">{{ summary.totalReps }}</p>
            </div>
          </div>
        </div>

        <!-- Streak + Favourite -->
        <div class="columns is-centered mb-5">
          <div class="column is-5-desktop">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Current Streak</p>
              <p class="title has-text-warning">{{ streak }} day{{ streak !== 1 ? 's' : '' }}</p>
              <p class="has-text-grey-light is-size-7">consecutive days with a workout</p>
            </div>
          </div>
          <div class="column is-5-desktop">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Favourite Exercise</p>
              <p class="title has-text-link">{{ favouriteExercise || '—' }}</p>
              <p class="has-text-grey-light is-size-7">most logged workout type</p>
            </div>
          </div>
        </div>

        <!-- Exercise Breakdown -->
        <div class="box has-background-dark mb-5" v-if="breakdown.length">
          <h2 class="title is-5 has-text-white mb-4">Workout Breakdown</h2>
          <div v-for="item in breakdown" :key="item.type" class="mb-3">
            <div class="is-flex is-justify-content-space-between mb-1">
              <span class="has-text-white">{{ item.type }}</span>
              <span class="has-text-grey-light">{{ item.count }} session{{ item.count !== 1 ? 's' : '' }}</span>
            </div>
            <progress
              class="progress is-link"
              :value="item.count"
              :max="breakdown[0].count"
              style="height: 10px;"
            ></progress>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="box has-background-dark" v-if="recentActivities.length">
          <h2 class="title is-5 has-text-white mb-4">Recent Activity</h2>
          <table class="table is-fullwidth is-striped is-narrow has-background-dark">
            <thead>
              <tr>
                <th class="has-text-grey-light">Exercise</th>
                <th class="has-text-grey-light">Reps</th>
                <th class="has-text-grey-light">Minutes</th>
                <th class="has-text-grey-light">Distance (km)</th>
                <th class="has-text-grey-light">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in recentActivities" :key="activity.id">
                <td class="has-text-white">{{ activity.exerciseTypeName }}</td>
                <td class="has-text-grey-light">{{ activity.reps ?? '—' }}</td>
                <td class="has-text-grey-light">{{ activity.minutes ?? '—' }}</td>
                <td class="has-text-grey-light">{{ activity.distanceKm ?? '—' }}</td>
                <td class="has-text-grey-light">{{ new Date(activity.performedAt).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!recentActivities.length" class="has-text-centered has-text-grey-light mt-5">
          No workouts logged yet. Head to <strong class="has-text-white">My Activity</strong> to add your first one!
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { currentUser } from '../pages/user';
import { getMySummary, listMyActivities, type Activity } from '../api/services';

const loading = ref(true);

const summary = ref({ totalActivities: 0, totalMinutes: 0, totalDistance: 0, totalReps: 0 });
const activities = ref<Activity[]>([]);

async function loadStats() {
  if (!currentUser.value) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const [summaryRes, activitiesRes] = await Promise.all([getMySummary(), listMyActivities()]);
    summary.value = summaryRes.summary;
    activities.value = activitiesRes.activities;
  } finally {
    loading.value = false;
  }
}

onMounted(loadStats);
watch(() => currentUser.value?.id, loadStats);

const recentActivities = computed(() =>
  [...activities.value]
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
    .slice(0, 8)
);

const breakdown = computed(() => {
  const counts: Record<string, number> = {};
  for (const a of activities.value) {
    counts[a.exerciseTypeName] = (counts[a.exerciseTypeName] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
});

const favouriteExercise = computed(() => breakdown.value[0]?.type ?? null);

const streak = computed(() => {
  if (!activities.value.length) return 0;
  const days = new Set(
    activities.value.map((a) => new Date(a.performedAt).toDateString())
  );
  let count = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toDateString())) {
      count++;
    } else {
      break;
    }
  }
  return count;
});
</script>
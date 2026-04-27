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
        <div class="columns is-multiline is-centered mb-5">
          <div class="column is-3-desktop is-6-tablet">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Total Workouts</p>
              <p class="title has-text-white">{{ insights.summary.totalActivities }}</p>
            </div>
          </div>
          <div class="column is-3-desktop is-6-tablet">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Total Minutes</p>
              <p class="title has-text-white">{{ insights.summary.totalMinutes }}</p>
            </div>
          </div>
          <div class="column is-3-desktop is-6-tablet">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">
                Total Distance
                <span class="ml-2">
                  <button type="button" class="button is-small" :class="distanceUnit === 'km' ? 'is-link' : 'is-light'" @click="setDistanceUnit('km')">km</button>
                  <button type="button" class="button is-small ml-1" :class="distanceUnit === 'miles' ? 'is-link' : 'is-light'" @click="setDistanceUnit('miles')">miles</button>
                </span>
              </p>
              <p class="title has-text-white">{{ displayTotalDistance }}</p>
            </div>
          </div>
          <div class="column is-3-desktop is-6-tablet">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Total Reps</p>
              <p class="title has-text-white">{{ insights.summary.totalReps }}</p>
            </div>
          </div>
        </div>

        <div class="columns is-centered mb-5">
          <div class="column is-5-desktop">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Current Streak</p>
              <p class="title has-text-warning">{{ insights.streak }} day{{ insights.streak !== 1 ? 's' : '' }}</p>
              <p class="has-text-grey-light is-size-7">consecutive days with a workout</p>
            </div>
          </div>
          <div class="column is-5-desktop">
            <div class="box has-background-dark has-text-centered">
              <p class="heading has-text-grey-light">Favourite Exercise</p>
              <p class="title has-text-link">{{ insights.favouriteExercise || '—' }}</p>
              <p class="has-text-grey-light is-size-7">most logged workout type</p>
            </div>
          </div>
        </div>

        <div class="box has-background-dark mb-5" v-if="insights.breakdown.length">
          <h2 class="title is-5 has-text-white mb-4">Workout Breakdown</h2>
          <div v-for="item in insights.breakdown" :key="item.type" class="mb-3">
            <div class="is-flex is-justify-content-space-between mb-1">
              <span class="has-text-white">{{ item.type }}</span>
              <span class="has-text-grey-light">{{ item.count }} session{{ item.count !== 1 ? 's' : '' }}</span>
            </div>
            <progress
              class="progress is-link"
              :value="item.count"
              :max="insights.breakdown[0].count"
              style="height: 10px;"
            ></progress>
          </div>
        </div>

        <div class="box has-background-dark" v-if="insights.recentActivities.length">
          <h2 class="title is-5 has-text-white mb-4">Recent Activity</h2>
          <table class="table is-fullwidth is-narrow has-background-dark">
            <thead>
              <tr>
                <th class="has-text-grey-light">Exercise</th>
                <th class="has-text-grey-light">Reps</th>
                <th class="has-text-grey-light">Minutes</th>
                <th class="has-text-grey-light">Distance ({{ distanceUnit }})</th>
                <th class="has-text-grey-light">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in insights.recentActivities" :key="activity.id">
                <td class="has-text-white">{{ activity.exerciseTypeName }}</td>
                <td class="has-text-grey-light">{{ activity.reps ?? '—' }}</td>
                <td class="has-text-grey-light">{{ activity.minutes ?? '—' }}</td>
                <td class="has-text-grey-light">{{ activity.distanceKm != null ? fromKm(activity.distanceKm).toFixed(2) : '—' }}</td>
                <td class="has-text-grey-light">{{ new Date(activity.performedAt).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!insights.recentActivities.length" class="has-text-centered has-text-grey-light mt-5">
          No workouts logged yet. Head to <strong class="has-text-white">My Activity</strong> to add your first one!
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, computed, watch } from 'vue';
import { currentUser } from '../pages/user';
import { distanceUnit, setDistanceUnit, fromKm } from '../utils/distanceUnit';
import { useInsightsStore } from '../stores/insightsStore';

const insightsStore = useInsightsStore();
const loading = insightsStore.loading;
const insights = insightsStore.insights;

const displayTotalDistance = computed(() => {
  const val = fromKm(insights.summary.totalDistance);
  return `${val.toFixed(1)} ${distanceUnit.value}`;
});

function loadStats() {
  void insightsStore.refresh(!!currentUser.value);
}

onMounted(loadStats);
watch(() => currentUser.value?.id, loadStats);

function onActivitiesChanged() {
  loadStats();
}

onMounted(() => {
  window.addEventListener('activities:changed', onActivitiesChanged);
});

onBeforeUnmount(() => {
  window.removeEventListener('activities:changed', onActivitiesChanged);
});
</script>
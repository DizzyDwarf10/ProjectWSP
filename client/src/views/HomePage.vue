<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 980px; margin: 2rem auto;">
        <h1 class="title is-2 has-text-white">
          <template v-if="isLoggedIn">Hello, {{ userName }}!</template>
          <template v-else>Exercise Hub</template>
        </h1>
        <p class="subtitle is-5 has-text-grey-light mb-4">
          <template v-if="isLoggedIn">All of your stats shown here.</template>
          <template v-else>Track workouts, compare with friends, and manage your fitness all from one app.</template>
        </p>
        <div class="columns is-multiline is-mobile">
          <div class="column is-6-mobile" v-for="item in summaryCards" :key="item.label">
            <div class="box has-background-black-ter p-4">
              <div class="is-size-7 has-text-grey-light is-flex is-align-items-center" style="gap:0.4rem;">
                {{ item.label }}
                <template v-if="item.label === 'Total Distance'">
                  <button type="button" class="button is-small" :class="distanceUnit === 'km' ? 'is-link' : 'is-light'" @click="setDistanceUnit('km')">km</button>
                  <button type="button" class="button is-small" :class="distanceUnit === 'miles' ? 'is-link' : 'is-light'" @click="setDistanceUnit('miles')">miles</button>
                </template>
              </div>
              <div class="title is-4 has-text-white mt-2 mb-1">{{ item.value }}</div>
              <div class="is-size-7 has-text-link-light">{{ item.details }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getMyInsights, type ActivityInsights } from '../api/services';
import { currentUser } from '../pages/user';
import { distanceUnit, setDistanceUnit, fromKm } from '../utils/distanceUnit';

const emptyInsights: ActivityInsights = {
  summary: {
    totalActivities: 0,
    totalMinutes: 0,
    totalDistance: 0,
    totalReps: 0
  },
  breakdown: [],
  favouriteExercise: null,
  streak: 0,
  recentActivities: []
};

const isLoggedIn = computed(() => !!currentUser.value);
const userName = computed(() => currentUser.value?.name || 'User');
const insights = ref<ActivityInsights>(emptyInsights);

async function refreshHome() {
  if (!currentUser.value) {
    insights.value = emptyInsights;
    return;
  }
  insights.value = await getMyInsights();
}

const summaryCards = computed(() => [
  {
    label: 'Total Activities',
    value: insights.value.summary.totalActivities,
    details: `${insights.value.summary.totalReps} total reps`
  },
  {
    label: 'Current Streak',
    value: `${insights.value.streak} day${insights.value.streak === 1 ? '' : 's'}`,
    details: 'consecutive active days'
  },
  {
    label: 'Total Distance',
    value: `${fromKm(insights.value.summary.totalDistance).toFixed(2)} ${distanceUnit.value}`,
    details: 'traveled across all workouts'
  },
  {
    label: 'Favourite Exercise',
    value: insights.value.favouriteExercise || 'None yet',
    details: insights.value.recentActivities[0]?.exerciseTypeName || 'log an activity to start'
  }
]);

watch(
  () => currentUser.value?.id,
  () => {
    void refreshHome();
  },
  { immediate: true }
);
</script>


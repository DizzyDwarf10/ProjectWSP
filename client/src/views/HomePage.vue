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
import { computed, watch } from 'vue';
import { currentUser } from '../pages/user';
import { distanceUnit, setDistanceUnit, fromKm } from '../utils/distanceUnit';
import { useInsightsStore } from '../stores/insightsStore';

const insightsStore = useInsightsStore();

const isLoggedIn = computed(() => !!currentUser.value);
const userName = computed(() => currentUser.value?.name || 'User');

const summaryCards = computed(() => [
  {
    label: 'Total Activities',
    value: insightsStore.insights.summary.totalActivities,
    details: `${insightsStore.insights.summary.totalReps} total reps`
  },
  {
    label: 'Current Streak',
    value: `${insightsStore.insights.streak} day${insightsStore.insights.streak === 1 ? '' : 's'}`,
    details: 'consecutive active days'
  },
  {
    label: 'Total Distance',
    value: `${fromKm(insightsStore.insights.summary.totalDistance).toFixed(2)} ${distanceUnit.value}`,
    details: 'traveled across all workouts'
  },
  {
    label: 'Favourite Exercise',
    value: insightsStore.insights.favouriteExercise || 'None yet',
    details: insightsStore.insights.recentActivities[0]?.exerciseTypeName || 'log an activity to start'
  }
]);

watch(
  () => currentUser.value?.id,
  () => {
    void insightsStore.refresh(!!currentUser.value);
  },
  { immediate: true }
);
</script>


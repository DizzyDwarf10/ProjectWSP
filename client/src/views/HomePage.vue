<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <div class="box has-background-dark has-text-centered" style="max-width: 700px; margin: 2rem auto;">
        <h1 class="title is-2 has-text-white">
          <template v-if="isLoggedIn">Hello, {{ userName }}!</template>
          <template v-else>Hello</template>
        </h1>
        <p class="subtitle is-5 has-text-grey-light mb-5">Here's a summary of your activity.</p>
        <div class="box has-background-black-ter p-5">
          <div class="has-text-left mb-4">
            <span class="title is-4 has-text-white">Recent Activity</span>
          </div>
          <div class="columns is-variable is-2 is-mobile">
            <div class="column" v-for="(item, idx) in summary" :key="idx">
              <div class="box has-background-link-light has-text-centered p-4">
                <div class="is-size-2 has-text-weight-bold has-text-link">{{ item.count }}</div>
                <div class="is-size-6 has-text-link mb-1">{{ item.label }}</div>
                <div class="is-size-6 has-text-link-light">{{ item.details }}</div>
              </div>
            </div>
          </div>
          <div class="has-text-grey-light is-size-7 mt-4">Based on posts you've created.</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { currentUser } from '../pages/user';
import { getMySummary } from '../api/services';

const isLoggedIn = computed(() => !!currentUser.value);
const user = computed(() => currentUser.value);
const userName = computed(() => user.value?.name || 'User');
const summaryData = ref({
  totalActivities: 0,
  totalMinutes: 0,
  totalDistance: 0,
  totalReps: 0
});

async function refreshSummary() {
  if (!isLoggedIn.value) {
    summaryData.value = {
      totalActivities: 0,
      totalMinutes: 0,
      totalDistance: 0,
      totalReps: 0
    };
    return;
  }

  const response = await getMySummary();
  summaryData.value = response.summary;
}

function getSummary() {
  if (!isLoggedIn.value) {
    return [
      { label: 'Today', count: 0, details: '' },
      { label: 'This Week', count: 0, details: '' },
      { label: 'This Month', count: 0, details: '' },
      { label: 'This Year', count: 0, details: '' },
    ];
  }

  return [
    {
      label: 'Total Activities',
      count: summaryData.value.totalActivities,
      details: `${summaryData.value.totalReps} reps`
    },
    {
      label: 'Total Minutes',
      count: summaryData.value.totalMinutes,
      details: `${summaryData.value.totalDistance.toFixed(2)} km`
    },
    {
      label: 'Total Distance',
      count: Number(summaryData.value.totalDistance.toFixed(2)),
      details: 'all time'
    },
    {
      label: 'Total Reps',
      count: summaryData.value.totalReps,
      details: 'all time'
    },
  ];
}

watch(
  () => currentUser.value?.id,
  () => {
    void refreshSummary();
  },
  { immediate: true }
);

const summary = computed(() => getSummary());
</script>


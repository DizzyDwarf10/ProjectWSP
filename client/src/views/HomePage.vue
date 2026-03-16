<template>
  <section class="section has-background-black-ter min-vh-100">
    <div class="container">
      <div class="box has-background-dark has-text-centered" style="max-width: 700px; margin: 2rem auto; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.25);">
        <h1 class="title is-2 has-text-white">
          <template v-if="isLoggedIn">Hello, {{ userName }}!</template>
          <template v-else>Hello</template>
        </h1>
        <p class="subtitle is-5 has-text-grey-light mb-5">Here's a summary of your activity.</p>
        <div class="box has-background-black-ter p-5" style="box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);">
          <div class="has-text-left mb-4">
            <span class="title is-4 has-text-white">Recent Activity</span>
          </div>
          <div class="columns is-variable is-2 is-mobile">
            <div class="column" v-for="(item, idx) in summary" :key="idx">
              <div class="box has-background-grey-darker has-text-centered p-4" style="border-radius: 12px;">
                <div class="is-size-2 has-text-weight-bold has-text-white">{{ item.count }}</div>
                <div class="is-size-6 has-text-grey-light mb-1">{{ item.label }}</div>
                <div class="is-size-6 has-text-grey-lighter">{{ item.details }}</div>
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
import { computed } from 'vue';
import { currentUser } from '../pages/store';
import users from '../users/users.json';
import workouts from '../users/workouts.json';

const isLoggedIn = computed(() => !!currentUser.value);
const user = computed(() => currentUser.value || users[0]);
const userName = computed(() => user.value?.name || 'User');

function getUserWorkouts() {
  if (!isLoggedIn.value) return [];
  return workouts.filter(w => w.userId === user.value.id);
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
  const now = new Date();
  const all = getUserWorkouts();
  const today = all.filter(w => new Date(w.dateTime).toDateString() === now.toDateString());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const thisWeek = all.filter(w => new Date(w.dateTime) >= weekStart);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = all.filter(w => new Date(w.dateTime) >= monthStart);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const thisYear = all.filter(w => new Date(w.dateTime) >= yearStart);

  function formatDetails(list: any[]) {
    if (!list.length) return '';
    return `${list.length * 6.0} km • ${list.length * 35} min`;
  }

  return [
    { label: 'Today', count: today.length, details: formatDetails(today) },
    { label: 'This Week', count: thisWeek.length, details: formatDetails(thisWeek) },
    { label: 'This Month', count: thisMonth.length, details: formatDetails(thisMonth) },
    { label: 'This Year', count: thisYear.length, details: formatDetails(thisYear) },
  ];
}

const summary = computed(() => getSummary());
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
</style>
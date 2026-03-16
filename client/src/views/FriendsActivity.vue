<template>
  <section class="section has-background-black-ter min-vh-100">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 900px; margin: 2rem auto;">
        <h1 class="title is-3 has-text-white has-text-centered">Friends Activity</h1>
        <div v-if="!currentUser" class="has-text-centered">
          <p class="has-text-grey-light">Please log in to see your friends activity.</p>
        </div>
        <div v-else>
          <div v-if="friends.length === 0" class="has-text-centered">
            <p class="has-text-grey-light">You have no friends added.</p>
          </div>
          <div v-else class="workout-cards-center">
            <div v-for="friend in friends" :key="friend.id" class="box has-background-black-ter mb-5 wide-card">
              <div class="friend-header mb-3" style="display: flex; align-items: center; justify-content: center;">
                <img :src="friend.profilePicture" alt="profile" class="profile-pic mr-3" style="width:48px; height:48px; border-radius:50%; object-fit:cover;" />
                <span class="friend-name has-text-white is-size-5">{{ friend.name }}</span>
              </div>
              <ul v-if="friendWorkouts(friend.id).length">
                <li v-for="(workout, idx) in friendWorkouts(friend.id)" :key="idx" class="workout-item-centered mb-3">
                  <div class="workout-content workout-purple wide-card">
                    <strong class="has-text-white">{{ workout.type }}</strong>
                    <span v-if="'reps' in workout && workout.reps" class="has-text-grey-light">&nbsp;— Reps: {{ workout.reps }}</span>
                    <span v-if="'time' in workout && workout.time" class="has-text-grey-light">&nbsp;— Time: {{ workout.time }} min</span>
                    <span v-if="'distance' in workout && workout.distance" class="has-text-grey-light">&nbsp;— Distance: {{ workout.distance }} km</span>
                    <span v-if="workout.dateTime" class="has-text-grey-light">&nbsp;— {{ new Date(workout.dateTime).toLocaleString() }}</span>
                    <span v-if="workout.photo"><br><img :src="workout.photo" alt="workout photo" class="workout-photo-centered-large mt-2"></span>
                  </div>
                </li>
              </ul>
              <p v-else class="has-text-grey-light has-text-centered">No workouts yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { currentUser } from '../pages/store';
import users from '../users/users.json';
import workoutsData from '../utils/getWorkouts';

const friends = computed(() => {
  if (!currentUser.value || !(currentUser.value as any).friends) return [];
  return users.filter(u => (currentUser.value as any).friends.includes(u.id));
});

function friendWorkouts(friendId: number) {
  return workoutsData.filter(w => w.userId === friendId);
}
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
.workout-cards-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.workout-item-centered {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.workout-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2em 1.5em;
  border-radius: 12px;
}
.workout-purple {
  background: linear-gradient(135deg, #7c3aed 80%, #a78bfa 100%);
  box-shadow: 0 2px 8px 0 rgba(124,58,237,0.15);
}
.workout-photo-centered-large {
  max-width: 180px;
  border-radius: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.wide-card {
  width: 100%;
  max-width: 700px;
}
</style>
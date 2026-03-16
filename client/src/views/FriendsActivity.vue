<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
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
          <div v-else>
            <div>
              <div v-for="friend in friends" :key="friend.id">
                <div class="box has-background-black-ter mb-5" style="max-width: 900px; margin: 2rem auto;">
                  <div class="level mb-3">
                    <div class="level-item has-text-centered">
                      <figure class="image is-96x96 mr-3" style="display:inline-block; width:96px; height:96px; overflow:hidden;">
                        <img :src="friend.profilePicture" alt="profile" style="border-radius:50%; object-fit:cover; width:96px; height:96px;" />
                      </figure>
                      <span class="friend-name has-text-white is-size-5 ml-2">{{ friend.name }}</span>
                    </div>
                  </div>
                  <ul v-if="friendWorkouts(friend.id).length">
                    <li v-for="(workout, idx) in friendWorkouts(friend.id)" :key="idx" class="mb-3">
                        <div class="box has-background-link has-text-centered">
                          <strong class="has-text-white">{{ workout.type }}</strong>
                          <span v-if="workout.reps" class="has-text-grey-light">&nbsp;— Reps: {{ workout.reps }}</span>
                          <span v-if="workout.time" class="has-text-grey-light">&nbsp;— Time: {{ workout.time }} min</span>
                          <span v-if="workout.distance" class="has-text-grey-light">&nbsp;— Distance: {{ workout.distance }} km</span>
                          <span v-if="workout.dateTime" class="has-text-grey-light">&nbsp;— {{ new Date(workout.dateTime).toLocaleString() }}</span>
                          <span v-if="workout.photo">
                            <br>
                            <figure class="image is-192x192 mt-2" style="margin:auto; width:192px; height:192px; overflow: hidden;">
                              <img :src="workout.photo" alt="workout photo" style="border-radius:10px; width:192px; height:192px; object-fit: cover; display: block;" />
                            </figure>
                          </span>
                      </div>
                    </li>
                  </ul>
                  <p v-else class="has-text-grey-light has-text-centered">No workouts yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { currentUser } from '../pages/user';
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


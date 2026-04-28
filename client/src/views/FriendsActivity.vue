<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 900px; margin: 2rem auto;">
        <h1 class="title is-3 has-text-white has-text-centered">Friends Activity</h1>
        <div v-if="!currentUser" class="has-text-centered">
          <p class="has-text-grey-light">Please log in to see your friends activity.</p>
        </div>
        <div v-else>
          <div v-if="orderedFriends.length === 0" class="has-text-centered">
            <p class="has-text-grey-light">You have no friends added.</p>
          </div>
          <div v-else>
            <div>
              <div v-for="friend in orderedFriends" :key="friend.id">
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
                    <li v-for="workout in friendWorkouts(friend.id)" :key="workout.id" class="mb-3">
                      <div class="box has-background-link has-text-centered">
                        <strong class="has-text-white">{{ workout.exerciseTypeName }}</strong>
                        <span v-if="workout.reps" class="has-text-grey-light">&nbsp;— Reps: {{ workout.reps }}</span>
                        <span v-if="workout.minutes" class="has-text-grey-light">&nbsp;— Time: {{ workout.minutes }} min</span>
                        <span v-if="workout.distanceKm" class="has-text-grey-light">&nbsp;— Distance: {{ formatDistance(workout.distanceKm) }}</span>
                        <span v-if="workout.performedAt" class="has-text-grey-light">&nbsp;— {{ new Date(workout.performedAt).toLocaleString() }}</span>
                        <span v-if="workout.photoUrl">
                          <br>
                          <figure class="image is-192x192 mt-2" style="margin:auto; width:192px; height:192px; overflow: hidden;">
                            <img :src="workout.photoUrl" alt="workout photo" style="border-radius:10px; width:192px; height:192px; object-fit: cover; display: block;" />
                          </figure>
                        </span>

                        <!-- Like & Comment Actions -->
                        <div class="mt-3 is-flex is-justify-content-center is-align-items-center" style="gap: 1rem;">
                          <button
                            class="button is-small"
                            :class="workout.likedByMe ? 'is-danger' : 'is-light'"
                            @click="handleLike(workout.id)"
                          >
                            <span>{{ workout.likedByMe ? '❤️' : '🤍' }} {{ workout.likeCount ?? 0 }}</span>
                          </button>
                          <button
                            class="button is-small is-light"
                            @click="toggleComments(workout.id)"
                          >
                            💬 {{ workout.comments?.length ?? 0 }} Comment{{ (workout.comments?.length ?? 0) !== 1 ? 's' : '' }}
                          </button>
                        </div>

                        <!-- Comments Section -->
                        <div v-if="openComments.has(workout.id)" class="mt-3" style="text-align:left;">
                          <div
                            v-for="comment in workout.comments"
                            :key="comment.id"
                            class="is-flex is-align-items-flex-start mb-2"
                            style="gap: 0.5rem;"
                          >
                            <figure class="image is-32x32" style="flex-shrink:0;">
                              <img
                                :src="comment.userProfilePicture || defaultAvatar"
                                alt="avatar"
                                style="border-radius:50%; width:32px; height:32px; object-fit:cover;"
                              />
                            </figure>
                            <div class="has-background-black-bis px-3 py-2" style="border-radius:8px; flex:1;">
                              <p class="has-text-white is-size-7 mb-1"><strong class="has-text-white">{{ comment.userName }}</strong></p>
                              <p class="has-text-grey-light is-size-7">{{ comment.body }}</p>
                            </div>
                            <button
                              v-if="currentUser && (comment.userId === currentUser.id || currentUser.role === 'admin')"
                              class="delete is-small mt-1"
                              @click="handleDeleteComment(workout.id, comment.id)"
                            />
                          </div>

                          <!-- Add Comment Input -->
                          <div class="is-flex mt-2" style="gap: 0.5rem;">
                            <input
                              v-model="commentDrafts[workout.id]"
                              class="input is-small"
                              type="text"
                              placeholder="Write a comment..."
                              @keyup.enter="handleAddComment(workout.id)"
                            />
                            <button
                              class="button is-small is-primary"
                              :disabled="!commentDrafts[workout.id]?.trim()"
                              @click="handleAddComment(workout.id)"
                            >
                              Post
                            </button>
                          </div>
                        </div>
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
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { currentUser } from '../pages/user';
import { useFriendsActivityStore } from '../stores/friendsActivityStore';
import { formatDistance } from '../utils/distanceUnit';

const store = useFriendsActivityStore();

const orderedFriends = computed(() => store.friends);

const openComments = ref<Set<number>>(new Set());
const commentDrafts = reactive<Record<number, string>>({});

const defaultAvatar = 'https://images.unsplash.com/photo-1672344048213-76b6e77304bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGR1bWJlbGx8ZW58MHx8MHx8fDA%3D';

function friendWorkouts(friendId: number) {
  return store.workoutsForFriend(friendId);
}

function toggleComments(activityId: number) {
  if (openComments.value.has(activityId)) {
    openComments.value.delete(activityId);
  } else {
    openComments.value.add(activityId);
  }
}

async function handleLike(activityId: number) {
  await store.like(activityId);
}

async function handleAddComment(activityId: number) {
  const body = (commentDrafts[activityId] || '').trim();
  if (!body) return;
  commentDrafts[activityId] = '';
  await store.postComment(activityId, body);
  openComments.value.add(activityId);
}

async function handleDeleteComment(activityId: number, commentId: number) {
  await store.removeComment(activityId, commentId);
}

onMounted(() => { void store.refresh(); });
watch(() => currentUser.value?.id, () => { void store.refresh(); });
</script>


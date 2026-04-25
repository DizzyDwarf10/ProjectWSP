<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 900px; margin: 2rem auto;">
        <h1 class="title is-3 has-text-white has-text-centered">People Search</h1>
        <p v-if="!currentUser" class="has-text-grey-light has-text-centered">Login to add friends.</p>
        <div v-else>
          <div class="field">
            <label class="label has-text-white">Search users</label>
            <div class="control">
              <input class="input" v-model="query" placeholder="Type a name" />
            </div>
          </div>

          <h2 class="title is-5 has-text-white mt-5">Results</h2>
          <div v-for="user in filteredUsers" :key="user.id" class="box has-background-black-ter mb-3 is-flex is-justify-content-space-between is-align-items-center">
            <div class="is-flex is-align-items-center">
              <figure class="image is-48x48 mr-3" style="overflow:hidden; border-radius:50%;">
                <img :src="user.profilePicture || fallbackProfile" alt="profile picture" style="object-fit:cover; width:48px; height:48px;" />
              </figure>
              <div>
                <div class="has-text-white">{{ user.name }}</div>
                <div class="has-text-grey-light is-size-7">Role: {{ user.role }}</div>
              </div>
            </div>
            <button
              v-if="!friendIds.has(user.id)"
              class="button is-link is-small"
              @click="addFriend(user.id)"
            >
              Add Friend
            </button>
            <button
              v-else
              class="button is-danger is-small"
              @click="removeFriend(user.id)"
            >
              Remove Friend
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { currentUser } from '../pages/user';
import { addMyFriend, listMyFriends, listUsers, removeMyFriend, type AppUser } from '../api/services';

const query = ref('');
const users = ref<AppUser[]>([]);
const friends = ref<AppUser[]>([]);
const fallbackProfile = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60';

const friendIds = computed(() => new Set(friends.value.map((friend) => friend.id)));

const filteredUsers = computed(() => {
  const text = query.value.trim().toLowerCase();
  return users.value
    .filter((user) => user.id !== currentUser.value?.id)
    .filter((user) => user.name.toLowerCase().includes(text));
});

async function refresh() {
  if (!currentUser.value) {
    users.value = [];
    friends.value = [];
    return;
  }

  const [usersResponse, friendsResponse] = await Promise.all([listUsers(), listMyFriends()]);
  users.value = usersResponse.users;
  friends.value = friendsResponse.friends;
}

async function addFriend(friendId: number) {
  await addMyFriend(friendId);
  await refresh();
}

async function removeFriend(friendId: number) {
  await removeMyFriend(friendId);
  await refresh();
}

onMounted(() => {
  void refresh();
});

watch(
  () => currentUser.value?.id,
  () => {
    void refresh();
  }
);
</script>
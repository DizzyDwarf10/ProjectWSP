import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { addMyFriend, listMyFriends, listUsers, removeMyFriend, type AppUser } from '../api/services';
import { currentUser } from '../pages/user';

export const usePeopleStore = defineStore('people', () => {
  const users = ref<AppUser[]>([]);
  const friends = ref<AppUser[]>([]);
  const error = ref<string | null>(null);

  const friendIds = computed(() => new Set(friends.value.map((f) => f.id)));

  async function refresh() {
    if (!currentUser.value) {
      users.value = [];
      friends.value = [];
      return;
    }
    error.value = null;
    const [usersRes, friendsRes] = await Promise.all([listUsers(), listMyFriends()]);
    users.value = usersRes.users;
    friends.value = friendsRes.friends;
  }

  async function addFriend(friendId: number) {
    error.value = null;
    await addMyFriend(friendId);
    await refresh();
  }

  async function removeFriend(friendId: number) {
    error.value = null;
    await removeMyFriend(friendId);
    await refresh();
  }

  return { users, friends, friendIds, error, refresh, addFriend, removeFriend };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { listFriendsFeed, listMyFriends, type Activity, type AppUser } from '../api/services';
import { currentUser } from '../pages/user';

export const useFriendsActivityStore = defineStore('friendsActivity', () => {
  const friends = ref<AppUser[]>([]);
  const activitiesByFriend = ref<Record<number, Activity[]>>({});
  const error = ref<string | null>(null);

  async function refresh() {
    if (!currentUser.value) {
      friends.value = [];
      activitiesByFriend.value = {};
      return;
    }
    error.value = null;
    const [friendsRes, feedRes] = await Promise.all([listMyFriends(), listFriendsFeed()]);
    friends.value = friendsRes.friends;

    const map: Record<number, Activity[]> = {};
    for (const activity of feedRes.activities) {
      if (!map[activity.userId]) map[activity.userId] = [];
      map[activity.userId].push(activity);
    }
    activitiesByFriend.value = map;
  }

  function workoutsForFriend(friendId: number): Activity[] {
    return activitiesByFriend.value[friendId] || [];
  }

  return { friends, activitiesByFriend, error, refresh, workoutsForFriend };
});

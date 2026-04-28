import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  listFriendsFeed,
  listMyFriends,
  toggleLike,
  addComment,
  deleteComment,
  type Activity,
  type ActivityComment,
  type AppUser
} from '../api/services';
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

  function findActivity(activityId: number): Activity | undefined {
    for (const activities of Object.values(activitiesByFriend.value)) {
      const found = activities.find(a => a.id === activityId);
      if (found) return found;
    }
    return undefined;
  }

  async function like(activityId: number) {
    const result = await toggleLike(activityId);
    const activity = findActivity(activityId);
    if (activity) {
      activity.likeCount = result.likeCount;
      activity.likedByMe = result.liked;
    }
  }

  async function postComment(activityId: number, body: string) {
    const result = await addComment(activityId, body);
    const activity = findActivity(activityId);
    if (activity) {
      if (!activity.comments) activity.comments = [];
      activity.comments.push(result.comment);
    }
    return result.comment;
  }

  async function removeComment(activityId: number, commentId: number) {
    await deleteComment(activityId, commentId);
    const activity = findActivity(activityId);
    if (activity?.comments) {
      activity.comments = activity.comments.filter((c: ActivityComment) => c.id !== commentId);
    }
  }

  return { friends, activitiesByFriend, error, refresh, workoutsForFriend, like, postComment, removeComment };
});

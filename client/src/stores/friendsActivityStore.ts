import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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

const PAGE_SIZE = 10;

export const useFriendsActivityStore = defineStore('friendsActivity', () => {
  const friends = ref<AppUser[]>([]);
  const chronologicalFeed = ref<Activity[]>([]);
  const total = ref(0);
  const isLoadingMore = ref(false);
  const error = ref<string | null>(null);

  // kept for backward compat (used by workoutsForFriend)
  const activitiesByFriend = computed<Record<number, Activity[]>>(() => {
    const map: Record<number, Activity[]> = {};
    for (const a of chronologicalFeed.value) {
      if (!map[a.userId]) map[a.userId] = [];
      map[a.userId].push(a);
    }
    return map;
  });

  const hasMore = computed(() => chronologicalFeed.value.length < total.value);

  async function refresh() {
    if (!currentUser.value) {
      friends.value = [];
      chronologicalFeed.value = [];
      total.value = 0;
      return;
    }
    error.value = null;
    chronologicalFeed.value = [];
    total.value = 0;
    const [friendsRes, feedRes] = await Promise.all([
      listMyFriends(),
      listFriendsFeed(PAGE_SIZE, 0)
    ]);
    friends.value = friendsRes.friends;
    chronologicalFeed.value = feedRes.activities;
    total.value = feedRes.total;
  }

  async function loadMore() {
    if (!hasMore.value || isLoadingMore.value) return;
    isLoadingMore.value = true;
    try {
      const res = await listFriendsFeed(PAGE_SIZE, chronologicalFeed.value.length);
      chronologicalFeed.value.push(...res.activities);
      total.value = res.total;
    } finally {
      isLoadingMore.value = false;
    }
  }

  function workoutsForFriend(friendId: number): Activity[] {
    return activitiesByFriend.value[friendId] || [];
  }

  function findActivity(activityId: number): Activity | undefined {
    return chronologicalFeed.value.find(a => a.id === activityId);
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

  return {
    friends,
    activitiesByFriend,
    chronologicalFeed,
    total,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    workoutsForFriend,
    like,
    postComment,
    removeComment
  };
});

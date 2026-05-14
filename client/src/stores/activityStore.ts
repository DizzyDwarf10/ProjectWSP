import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  createActivity,
  deleteActivity,
  listExerciseTypes,
  listMyActivities,
  updateActivity,
  toggleLike,
  type Activity,
  type ExerciseType
} from '../api/services';
import { toKm } from '../utils/distanceUnit';

const PAGE_SIZE = 10;

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([]);
  const exerciseTypes = ref<ExerciseType[]>([]);
  const total = ref(0);
  const isLoadingMore = ref(false);
  const error = ref<string | null>(null);

  const hasMore = computed(() => activities.value.length < total.value);

  // Already sorted DESC from server; keep computed for compatibility
  const sortedActivities = computed(() => activities.value);

  async function refresh() {
    error.value = null;
    activities.value = [];
    total.value = 0;
    const [typesRes, activitiesRes] = await Promise.all([
      listExerciseTypes(),
      listMyActivities(PAGE_SIZE, 0)
    ]);
    exerciseTypes.value = typesRes.exerciseTypes;
    activities.value = activitiesRes.activities;
    total.value = activitiesRes.total;
  }

  async function loadMore() {
    if (!hasMore.value || isLoadingMore.value) return;
    isLoadingMore.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const res = await listMyActivities(PAGE_SIZE, activities.value.length);
      activities.value.push(...res.activities);
      total.value = res.total;
    } finally {
      isLoadingMore.value = false;
    }
  }

  async function addActivity(payload: {
    exerciseTypeId: number;
    reps?: number | null;
    minutes?: number | null;
    distanceKm?: number | null;
    performedAt: string;
  }) {
    error.value = null;
    const res = await createActivity(payload);
    activities.value.unshift(res.activity);
    total.value += 1;
    window.dispatchEvent(new CustomEvent('activities:changed'));
  }

  async function editActivity(
    id: number,
    payload: {
      exerciseTypeId?: number;
      reps?: number | null;
      minutes?: number | null;
      distanceKm?: number | null;
      performedAt?: string;
    }
  ) {
    error.value = null;
    const res = await updateActivity(id, payload);
    const idx = activities.value.findIndex((a) => a.id === id);
    if (idx !== -1) activities.value[idx] = res.activity;
    window.dispatchEvent(new CustomEvent('activities:changed'));
  }

  async function like(activityId: number) {
    const result = await toggleLike(activityId);
    const activity = activities.value.find(a => a.id === activityId);
    if (activity) {
      activity.likeCount = result.likeCount;
      activity.likedByMe = result.liked;
    }
  }

  async function removeActivity(id: number) {
    error.value = null;
    await deleteActivity(id);
    activities.value = activities.value.filter((a) => a.id !== id);
    total.value = Math.max(0, total.value - 1);
    window.dispatchEvent(new CustomEvent('activities:changed'));
  }

  return {
    activities,
    exerciseTypes,
    total,
    isLoadingMore,
    hasMore,
    error,
    sortedActivities,
    refresh,
    loadMore,
    addActivity,
    editActivity,
    like,
    removeActivity
  };
});

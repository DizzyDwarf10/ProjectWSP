import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  createActivity,
  deleteActivity,
  listExerciseTypes,
  listMyActivities,
  updateActivity,
  type Activity,
  type ExerciseType
} from '../api/services';
import { toKm } from '../utils/distanceUnit';

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([]);
  const exerciseTypes = ref<ExerciseType[]>([]);
  const error = ref<string | null>(null);

  const sortedActivities = computed(() =>
    [...activities.value].sort(
      (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    )
  );

  async function refresh() {
    error.value = null;
    const [typesRes, activitiesRes] = await Promise.all([listExerciseTypes(), listMyActivities()]);
    exerciseTypes.value = typesRes.exerciseTypes;
    activities.value = activitiesRes.activities;
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

  async function removeActivity(id: number) {
    error.value = null;
    await deleteActivity(id);
    activities.value = activities.value.filter((a) => a.id !== id);
    window.dispatchEvent(new CustomEvent('activities:changed'));
  }

  return {
    activities,
    exerciseTypes,
    error,
    sortedActivities,
    refresh,
    addActivity,
    editActivity,
    removeActivity
  };
});

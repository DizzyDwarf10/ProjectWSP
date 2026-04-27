import { reactive, ref } from 'vue';
import { getMyInsights, type ActivityInsights } from '../api/services';

const EMPTY: ActivityInsights = {
  summary: { totalActivities: 0, totalMinutes: 0, totalDistance: 0, totalReps: 0 },
  breakdown: [],
  favouriteExercise: null,
  streak: 0,
  recentActivities: []
};

const insights = reactive<ActivityInsights>(structuredClone(EMPTY));
const loading = ref(false);

async function refresh(loggedIn: boolean) {
  if (!loggedIn) {
    Object.assign(insights, structuredClone(EMPTY));
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const data = await getMyInsights();
    Object.assign(insights, data);
  } finally {
    loading.value = false;
  }
}

export function useInsightsStore() {
  return { insights, loading, refresh };
}

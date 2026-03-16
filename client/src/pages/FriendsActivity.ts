import { defineStore } from "pinia";
import { ref } from "vue";
import type { Workout } from "../types";

export const useWorkoutTypesStore = defineStore("workoutTypes", () => {
  const workoutTypes = ref<Workout[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchWorkoutTypes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch("https://dummyjson.com/products/categories");
      const data = await res.json();
      workoutTypes.value = data.map((name: string, index: number) => ({
        id: index + 1,
        userId: 0, 
        type: name,
        duration: 0,
        calories: 0,
        date: new Date().toISOString(),
      }));
    } catch (err) {
      error.value = "Failed to fetch workout types.";
    } finally {
      loading.value = false;
    }
  };

  return { workoutTypes, loading, error, fetchWorkoutTypes };
});
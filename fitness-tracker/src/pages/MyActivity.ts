import { defineStore } from "pinia";
import { ref } from "vue";
import type { Workout } from "../types";

export const useWorkoutTrackerStore = defineStore("workoutTracker", () => {
  const workouts = ref<Workout[]>([]);

  const addWorkout = (type: string, duration: number, calories: number, notes?: string) => {
    workouts.value.push({
      id: Date.now(),
      userId: 0, // Set appropriately in your app
      type,
      duration,
      calories,
      date: new Date().toISOString(),
      notes
    });
  };

  return { workouts, addWorkout };
});
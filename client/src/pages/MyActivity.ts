import { defineStore } from "pinia";
import { ref } from "vue";
import type { Workout } from "../types";

export const useWorkoutTrackerStore = defineStore("workoutTracker", () => {
  const workouts = ref<Workout[]>([]);

  const addWorkout = (
    title: string,
    durationMinutes: number,
    date: string,
    description?: string,
    distanceKm?: number,
    picture?: string
  ) => {
    workouts.value.push({
      id: Date.now(),
      userId: 0, 
      title,
      durationMinutes,
      date,
      description,
      distanceKm,
      picture
    });
  };

  return { workouts, addWorkout };
});
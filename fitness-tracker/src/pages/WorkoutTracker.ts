import { defineStore } from "pinia"
import { ref } from "vue"
import type { WorkoutEntry } from "../types"

export const useWorkoutTrackerStore = defineStore("workoutTracker", () => {
  const workouts = ref<WorkoutEntry[]>([])

  const addWorkout = (exercise: string, reps: number) => {
    workouts.value.push({
      id: Date.now(),
      exercise,
      reps,
      date: new Date().toISOString()
    })
  }

  return { workouts, addWorkout }
})
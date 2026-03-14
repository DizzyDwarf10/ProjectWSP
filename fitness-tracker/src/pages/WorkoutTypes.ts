import { defineStore } from "pinia"
import { ref } from "vue"
import type { WorkoutType } from "../types"

export const useWorkoutTypesStore = defineStore("workoutTypes", () => {
  const workoutTypes = ref<WorkoutType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchWorkoutTypes = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch("https://dummyjson.com/products/categories")
      const data = await res.json()

      workoutTypes.value = data.map((name: string, index: number) => ({
        id: index + 1,
        name
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load workout types"
    } finally {
      loading.value = false
    }
  }

  return { workoutTypes, loading, error, fetchWorkoutTypes }
})
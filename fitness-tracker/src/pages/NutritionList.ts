import { defineStore } from "pinia"
import { ref } from "vue"
import type { NutritionItem } from "../types"

export const useNutritionStore = defineStore("nutrition", () => {
  const items = ref<NutritionItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchNutrition = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch("https://dummyjson.com/recipes")
      const data = await res.json()
      items.value = data.recipes
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load nutrition data"
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, fetchNutrition }
})
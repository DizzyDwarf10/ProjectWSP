import { createRouter, createWebHistory } from "vue-router";

import IndexList from "@/views/IndexList.vue";
import WorkoutTypes from "@/views/WorkoutTypes.vue";
import NutritionList from "@/views/NutritionList.vue";
import WorkoutTracker from "@/views/WorkoutTracker.vue";
import ContactList from "@/views/ContactList.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: IndexList },
    { path: "/workouts", component: WorkoutTypes },
    { path: "/nutrition", component: NutritionList },
    { path: "/tracker", component: WorkoutTracker },
    { path: "/contact", component: ContactList }
  ]
});

export default router;
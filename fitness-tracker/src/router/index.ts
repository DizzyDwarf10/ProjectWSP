import { createRouter, createWebHistory } from 'vue-router'

import IndexList from '../views/IndexList.vue'
import WorkoutTracker from '../views/WorkoutTracker.vue'
import ContactList from '../views/ContactList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexList,
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: () => import('../views/WorkoutTypes.vue'),
    },
    {
      path: '/nutrition',
      name: 'nutrition',
      component: () => import('../views/NutritionList.vue'),
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: WorkoutTracker,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactList,
    }
  ],
})

export default router
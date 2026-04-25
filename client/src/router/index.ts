import { createRouter, createWebHistory } from 'vue-router';
import { authReady, currentUser } from '../pages/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/HomePage',
    },
    {
      path: '/HomePage',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/FriendsActivity',
      name: 'friendsactivity',
      component: () => import('../views/FriendsActivity.vue'),
    },
    {
      path: '/StatisticsPage',
      name: 'statistics',
      component: () => import('../views/StatisticsPage.vue'),
    },
    {
      path: '/MyActivity',
      name: 'myactivity',
      component: () => import('../views/MyActivity.vue'),
    },
    {
      path: '/SignUp',
      name: 'signup',
      component: () => import('../views/SignUp.vue'),
    },
    {
      path: '/Admin',
      name: 'admin',
      component: () => import('../views/Admin.vue'),
    },
    {
      path: '/PeopleSearch',
      name: 'peoplesearch',
      component: () => import('../views/PeopleSearch.vue'),
    },
  ],
});

export default router;

const authRequiredRoutes = new Set(['friendsactivity', 'myactivity', 'peoplesearch']);

router.beforeEach((to, _from, next) => {
  if (!authReady.value) {
    next();
    return;
  }

  if (authRequiredRoutes.has(String(to.name)) && !currentUser.value) {
    next('/SignUp');
    return;
  }

  if (to.name === 'admin' && currentUser.value?.role !== 'admin') {
    next('/HomePage');
    return;
  }

  next();
});
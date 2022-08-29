import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/user/:uid',
    name: 'User',
    component: () => import('../views/User.vue'),
  },
  {
    path: '/ranking/:id',
    name: 'RankingItem',
    component: () => import('../views/RankkingItem.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;

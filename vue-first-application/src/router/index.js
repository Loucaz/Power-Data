import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('../views/Posts.vue'),
  },
  {
    path: '/tables',
    name: 'tables',
    component: () => import('../views/Tables.vue'),
  },
  {
    path: '/bases',
    name: 'bases',
    component: () => import('../views/Bases.vue'),
  },
  {
    path: '/bases/:id',
    name: 'base',
    component: () => import('../views/Base.vue'),
  },
  {
    path: '/bases/:id/:idTable',
    name: 'table',
    component: () => import('../views/Table.vue'),
  },
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

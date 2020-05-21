import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

var jwtDecode = require('jwt-decode');

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
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tables',
    name: 'tables',
    component: () => import('../views/Tables.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/bases',
    name: 'bases',
    component: () => import('../views/Bases.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/bases/:id',
    name: 'base',
    component: () => import('../views/Base.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/bases/:id/:idTable',
    name: 'table',
    component: () => import('../views/Table.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/bases/:id/:idTable/form',
    name: 'formulaire',
    component: () => import('../views/Formulaire.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/dashboard',
    name: 'userboard',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tutobases',
    name: 'tutobases',
    component: () => import('../views/Tutobases.vue'),
  },
  {
    path: '/Tutotables',
    name: 'Tutotables',
    component: () => import('../views/Tutotables.vue'),
  },
  {
    path: '/Tutodonnees',
    name: 'Tutodonnees',
    component: () => import('../views/Tutodonnees.vue'),
  },
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if ((localStorage.getItem('jwt') == null) || (jwtDecode(localStorage.getItem('jwt')).exp < Date.now() / 1000)) {
      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      });
      localStorage.clear();
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router;

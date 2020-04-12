import Vue from 'vue'
import VueRouter from 'vue-router'
import fireBaseInstance from "../firebase/firebase";

Vue.use(VueRouter)


const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dates',
    name: 'dates',
    component: () => import('../views/Dates.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('../views/Sign-Up.vue')
  },
  {
    path: '/forgot',
    name: 'forgot-password',
    component: () => import('../views/Forgot.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/reminders',
    name: 'reminders',
    component: () => import('../views/Reminders.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/biotz',
    name: 'biotz',
    component: () => import('../views/Biotz.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
 const currentUser = fireBaseInstance.firebase.auth().currentUser;
 const requiredAuth = to.matched.some(record => record.meta.requiresAuth);
 const moreDetails = to.matched.some(record => record.meta.moreDetails);
 if (requiredAuth && !currentUser) next ('login');
 else if (!requiredAuth && currentUser && !moreDetails) next ('home');
 else next();
});

export default router

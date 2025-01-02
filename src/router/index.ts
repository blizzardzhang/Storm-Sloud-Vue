import NProgress from 'nprogress'; // progress bar
import { createRouter, createWebHistory } from "vue-router";
import { appRoutes } from './routes';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base';


NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior(){
    return { top: 0 }
  }
})

export default router;
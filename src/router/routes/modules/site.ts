import type { AppRouteRecordRaw } from '@/router/routes/types.ts';
import { DEFAULT_LAYOUT } from '@/router/routes/base.ts';


const SITE: AppRouteRecordRaw ={
  path: '/site',
  name: 'Site',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.site',
    requiresAuth: true,
    permission:'/site',
  },
  children: [
    {
      path: 'article',
      name: 'Article',
      component: () => import('@/views/site/article/index.vue'),
      meta: {
        locale: 'menu.site.article',
        requiresAuth: true,
        permission:'/site/article'
      },
    },
    {
      path: 'arti-tag',
      name: 'ArtiTag',
      component: () => import('@/views/site/arti-tags/index.vue'),
      meta: {
        locale: 'menu.site.artiTag',
        requiresAuth: true,
        permission:'/site/artiTag',
      },
    },
    {
      path: 'arti-category',
      name: 'ArtiCategory',
      component: () => import('@/views/site/arti-category/index.vue'),
      meta: {
        locale: 'menu.site.artiCategory',
        requiresAuth: true,
        permission:'/site/artiCategory',
      },
    }
  ],
}
export default SITE;
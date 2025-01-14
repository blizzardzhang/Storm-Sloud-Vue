import type { AppRouteRecordRaw } from '@/router/routes/types.ts';
import { DEFAULT_LAYOUT } from '@/router/routes/base.ts';


const RESOURCE: AppRouteRecordRaw ={
  path: '/resource',
  name: 'Resource',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.resource',
    requiresAuth: true,
    permission:'/resource',
  },
  children: [
    {
      path: 'oss',
      name: 'Oss',
      component: () => import('@/views/resource/oss/index.vue'),
      meta: {
        locale: 'menu.resource.oss',
        requiresAuth: true,
        permission:'/resource/oss'
      },
    },
    {
      path: 'ossConfig',
      name: 'OssConfig',
      component: () => import('@/views/resource/oss/config/index.vue'),
      meta: {
        locale: 'menu.resource.ossConfig',
        requiresAuth: true,
        permission:'/resource/ossConfig',
      },
    }
  ],
}
export default RESOURCE;
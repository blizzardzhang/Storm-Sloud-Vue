import type { AppRouteRecordRaw } from "@/router/routes/types.ts";
import { DEFAULT_LAYOUT } from "@/router/routes/base.ts";

const SYSTEM: AppRouteRecordRaw = {
    path: '/system',
    name: 'system',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.system',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 1,
    },
    children: [
        {
            path: 'user',
            name: 'user',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
                locale: 'menu.system.user',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'user',
            name: 'user',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
                locale: 'menu.system.user',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
                locale: 'menu.system.menu',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'role',
            name: 'role',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
                locale: 'menu.system.role',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'client',
            name: 'client',
            component: () => import('@/views/system/client/index.vue'),
            meta: {
                locale: 'menu.system.client',
                requiresAuth: true,
                roles:['*']
            }
        }
    ],
}

export default SYSTEM;
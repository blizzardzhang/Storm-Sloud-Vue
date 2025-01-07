import type { AppRouteRecordRaw } from "@/router/routes/types.ts";
import { DEFAULT_LAYOUT } from "@/router/routes/base.ts";

const SYSTEM: AppRouteRecordRaw = {
    path: '/system',
    name: 'System',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.system',
        requiresAuth: true,
        permission:'/system',
        icon: 'icon-dashboard',
        order: 1,
    },
    children: [
        {
            path: 'user',
            name: 'User',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
                locale: 'menu.system.user',
                requiresAuth: true,
                permission:'/system/user',
            },
        },
        {
            path: 'menu',
            name: 'Menu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
                locale: 'menu.system.menu',
                requiresAuth: true,
                permission:'/system/menu',
            },
        },
        {
            path: 'role',
            name: 'Role',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
                locale: 'menu.system.role',
                requiresAuth: true,
                permission:'/system/role',
            },
        },
        {
            path: 'client',
            name: 'Client',
            component: () => import('@/views/system/client/index.vue'),
            meta: {
                locale: 'menu.system.client',
                requiresAuth: true,
                permission:'/system/client',
            }
        }
    ],
}

export default SYSTEM;
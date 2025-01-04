import type { Router } from 'vue-router'
import { setRouteEmitter } from '@/utils/route-listener.ts'
import setupUserLoginInfoGuard from '@/router/guard/userLoginInfo.ts'
import setupPermissionGuard from '@/router/guard/permission.ts'

/**
 * 设置页面守卫
 *
 * @param router Vue Router 实例
 *
 * 在路由跳转前触发，设置路由发射器
 */
function setupPageGuard(router:Router) {
  router.beforeEach((to, _from, _next) => {
    setRouteEmitter(to)
  })
}

// 创建路由守卫函数
export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
}
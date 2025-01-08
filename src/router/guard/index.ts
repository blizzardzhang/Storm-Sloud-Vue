import type { Router } from 'vue-router'
import { setRouteEmitter } from '@/utils/route-listener.ts'
import setupUserLoginInfoGuard from '@/router/guard/userLoginInfo.ts'

/**
 * 设置页面守卫
 *
 * 在路由跳转前触发，设置路由发射器。
 *
 * @param router Vue Router 实例
 */
/**
 * 设置页面守卫
 *
 * @param router Vue Router 实例
 *
 * 在路由跳转前触发，设置路由发射器
 */
function setupPageGuard(router:Router) {
  router.beforeEach(async (to) => {
    setRouteEmitter(to)
  })
}


// 创建路由守卫函数
export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupUserLoginInfoGuard(router);
}
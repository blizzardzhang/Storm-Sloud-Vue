import type { Router, LocationQueryRaw } from "vue-router";
import { useUserStore } from "@/store";
import { isLogin } from "@/utils/auth.ts";
import NProgress from 'nprogress' // progress bar

// 登录守卫，判断用户是否登录，如果没有登录则重定向到登录页面
export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      if (userStore.permissions) {
        next();
      }
      try {
        await userStore.info();
        next();
      } catch (err) {
        await userStore.logout();
        next({
          name: "login",
          query: {
            redirect: to.name,
            ...to.query,
          } as LocationQueryRaw,
        });
      }
    } else {
      if (to.name === "login") {
        next();
        return;
      }
      next({
        name: "login",
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}

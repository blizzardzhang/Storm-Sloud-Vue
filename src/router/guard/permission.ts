import type { Router, RouteRecordNormalized } from "vue-router";
import NProgress from "nprogress"; // progress bar
import { useAppStore } from "@/store";
import usePermission from "@/hooks/permission.ts";
import { NOT_FOUND, WHITE_LIST } from '@/router/constants.ts'

//权限守卫，用于拦截路由跳转，判断是否有访问该页面的权限
export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    NProgress.start();
    const appstore = useAppStore();
    const Permission = usePermission();
    const hasPermission = Permission.accessRouter(to);
    //对来自服务端的路由进行权限过滤
    if (
      !appstore.appAsyncMenus.length &&
      !WHITE_LIST.find((item) => item.name === to.name)
    ) {
      await appstore.fetchServerMenu();
      const serverRouters = [...appstore.appAsyncMenus,...WHITE_LIST];
      let exist = false;
      while (!exist && serverRouters.length) {
        const element = serverRouters.shift();
        if (element?.name === to.name) {
          exist = true;
        } else if (element?.children) {
          serverRouters.push(...(element.children as RouteRecordNormalized[]));
        }
      }
      if(exist && hasPermission){
        next();
      } else {
        next( NOT_FOUND);
      }
    }
    NProgress.done();
  });
}

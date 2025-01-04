import useUserStore from "@/store/modules/user";
import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router";

// 权限控制
export default function usePermission() {
  const useStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.permission ||
        useStore.permissions?.includes(route.meta?.permission as string)
      );
    },


    // filterRoutes(routes: RouteRecordRaw[]) {
    //   const res: RouteRecordRaw[] = [];
    //   routes.forEach((route) => {
    //     const tmp = { ...route };
    //     if (tmp.children) {
    //       tmp.children = this.filterRoutes(tmp.children);
    //     }
    //     if (this.accessRouter(tmp)) {
    //       res.push(tmp);
    //     }
    //   });
    //   return res;
    // },
  };
}

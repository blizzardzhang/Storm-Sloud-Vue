import { useAppStore } from "@/store";
import { computed } from "vue";
import { cloneDeep } from "lodash";
import type { RouteRecordNormalized } from "vue-router";

export default function useMenuTree() {
  const appstore = useAppStore();
  const appRoute = computed(() => {
    return appstore.appAsyncMenus;
  });
  // 菜单树结构
  const menuTree = computed(() => {
    return cloneDeep(appRoute.value) as RouteRecordNormalized[];
  });

  return {
    menuTree,
  };
}

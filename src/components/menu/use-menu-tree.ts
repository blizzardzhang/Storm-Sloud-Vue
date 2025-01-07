import { useAppStore } from "@/store";
import { computed, ref, onMounted, watch } from 'vue'
import { cloneDeep } from 'lodash'
import type { RouteRecordNormalized } from "vue-router";

export default function useMenuTree() {
  const appstore = useAppStore();
  const appRoute = computed(() => appstore.appAsyncMenus);

  // 创建一个响应式变量来存储 menuTree
  const menuTree = ref<RouteRecordNormalized[]>([]);

  // 当组件挂载时，检查是否需要从服务器加载菜单
  onMounted(async () => {
    if (appRoute.value.length === 0) {
      await appstore.fetchServerMenu();
      // 更新 menuTree，使用最新的 appRoute 值
      menuTree.value = cloneDeep(appRoute.value);
    }
  });

  // 监听 appRoute 的变化，并更新 menuTree
  watch(appRoute, (newVal) => {
    menuTree.value = cloneDeep(newVal);
  }, { immediate: true });

  return {
    menuTree: computed(() => menuTree.value),
  };
}


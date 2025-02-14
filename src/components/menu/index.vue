<script lang="tsx">
import { compile, computed, defineComponent, h, ref } from 'vue'
import { useI18n } from "vue-i18n";
import { type RouteRecordRaw, useRoute, useRouter } from "vue-router";
import useMenuTree from "./use-menu-tree";
import { useAppStore } from "@/store";
import { listenerRouteChange } from "@/utils/route-listener.ts";

export default defineComponent({
  emit: ["collapse"],
  setup() {
    const { t } = useI18n();
    const { menuTree } = useMenuTree();
    const route = useRoute();
    const router = useRouter();
    const appStore = useAppStore();

    // 是否顶部菜单
    const topMenu = computed(() => appStore.topMenu);
    // 折叠菜单
    const collapsed = computed({
      get() {
        if (appStore.device === "desktop") return appStore.menuCollapse;
        return false;
      },
      set(value: boolean) {
        appStore.updateSettings({ menuCollapse: value });
      },
    });
    // 展开和选中菜单项
    const openKeys = ref<string[]>([]);
    const selectedKey = ref<string[]>([]);

    // 路由跳转
    const goto = (item: RouteRecordRaw) => {
      if (route.name === item.name) {
        selectedKey.value = [item.name as string];
        return;
      }
      router.push({
        name: item.name,
      });
    };
    // 设置折叠
    const setCollapse = (val: boolean) => {
      if (appStore.device === "desktop") {
        appStore.updateSettings({ menuCollapse: val });
      }
    };

    // 渲染菜单项
    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((element) => {
            const icon = element.meta?.icon
              ? () => h(compile(`<${element.meta?.icon}/>`))
              : null;
            const node =
              element?.children && element.children.length > 0 ? (
                <a-sub-menu
                  key={element?.name}
                  v-slots={{
                    icon,
                    title: () => h(compile(t(element.meta?.locale || ""))),
                  }}
                >
                  {travel(element?.children)}
                </a-sub-menu>
              ) : (
                <a-menu-item
                  key={element?.name}
                  v-slots={{ icon }}
                  onClick={() => goto(element)}
                >
                  {t(element?.meta?.locale || "")}
                </a-menu-item>
              );
            nodes.push(node as never);
          });
        }
        return nodes;
      }
      return travel(menuTree.value);
    };

    // 查找展开的菜单
    const findMenuOpenKeys = (target: string) => {
      const result: string[] = [];
      let isFind = false;
      // 回溯查找路径函数
      const backtrack = (item: RouteRecordRaw, keys: string[]) => {
        // 找到目标菜单
        if (item.name === target) {
          isFind = true;
          result.push(...keys);
          return;
        }
        // 查找子菜单
        if (item.children?.length) {
          item.children.forEach((child) => {
            backtrack(child, [...keys, child.name as string]);
          });
        }
      };
      // 查找路径
      menuTree.value.forEach((item: RouteRecordRaw) => {
        // 如果已经找到目标菜单，则不再查找其他路径
        if (isFind) return;
        backtrack(item, [item.name as string]);
      });
      return result;
    };
    // 监听路由变化
    listenerRouteChange((newRoute) => {
      const menuOpenKeys = findMenuOpenKeys(newRoute.name as string);
      const keySet = new Set([ ...menuOpenKeys,...openKeys.value]);
      openKeys.value = [...keySet];
      // 设置选中菜单项
      selectedKey.value = [ menuOpenKeys[menuOpenKeys.length - 1]];
    }, true);

    return () => (
      <a-menu
        mode={topMenu.value ? "horizontal" : "vertical"}
        v-model:collapsed={collapsed.value}
        v-model:openKeys={openKeys.value}
        show-collapse-button={appStore.device !== "mobile"}
        auto-open={false}
        selected-keys={selectedKey.value}
        auto-open-selected={true}
        level-indent={34}
        style="height: 100%;width: 100%;"
        onCollapse={setCollapse}
      >
        {renderSubMenu()}
      </a-menu>
    );
  },
});
</script>



<style scoped lang="less">
:deep(.arco-menu-inner) {
  .arco-menu-inline-header {
    display: flex;
    align-items: center;
  }

  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }
}
</style>

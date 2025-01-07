<template>
  <a-layout class="layout" :class="{mobile: appStore.hideMenu}">
    <!-- 导航栏 -->
    <div v-if="navbar" class="layout-navbar">
      <NavBar/>
    </div>
    <a-layout>
      <a-layout>
        <!--侧边栏-->
        <a-layout-sider
          v-if="renderMenu"
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{paddingTop: navbar ? `60px` : ''}"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div class="menu-wrapper">
            <Menu/>
          </div>
        </a-layout-sider>
        <!-- 手机端菜单抽屉面板 -->
        <a-drawer
          v-if="hideMenu"
          :visible="drawerVisible"
          placement="left"
          :footer="false"
          mask-closable
          :closable="false"
          @cancel="drawerCancel"
        >
          <Menu/>
        </a-drawer>
        <a-layout class="layout-content" :style="paddingStyle">
          <TabBar v-if="appStore.tabBar"/>
          <a-layout-content>
            <PageLayout/>
          </a-layout-content>
          <Footer v-if="footer"/>
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>

import NavBar from '@/components/navbar/index.vue';
import Menu from '@/components/menu/index.vue';
import TabBar from '@/components/tab-bar/index.vue';
import PageLayout from './page-layout.vue';
import Footer from '@/components/footer/index.vue';
import { useAppStore, useUserStore } from '@/store'
import { computed, onMounted, provide, ref, watch } from 'vue'
import useResponsive from '@/hooks/responsive.ts'
import { useRoute } from 'vue-router'
import usePermission from '@/hooks/permission.ts'

const isInit = ref(false);
const appStore = useAppStore();
const userStore = useUserStore();
const router = useRoute();
const route = useRoute();
const permissions = usePermission();
const navbar = computed(() => appStore.navbar);
const renderMenu = computed(() => appStore.menu && !appStore.topMenu);
const hideMenu = computed(() => appStore.hideMenu);
const collapsed = computed(() => {
  return appStore.menuCollapse;
});
const menuWidth = computed(() => {
  return appStore.menuCollapse ? 48 : appStore.menuWidth;
});
const footer = computed(() => appStore.footer)

useResponsive(true);
// 计算padding样式
const navbarHeight = `60px`;
const paddingStyle = computed(() => {
  const paddingLeft = renderMenu.value && !hideMenu.value
    ? {paddingLeft: `${menuWidth.value}px`}
    : {};
  const paddingTop = navbar.value ? {paddingTop: navbarHeight} : {};
  return {...paddingLeft, ...paddingTop};
});


// 菜单展开收起
const setCollapsed = (val: boolean) => {
  if (!isInit.value) return; //解决菜单初始化渲染问题 for page initialization menu state problem
  appStore.updateSettings({ menuCollapse: val });
};

// 菜单抽屉
const drawerVisible = ref(false);
const drawerCancel = () => {
  drawerVisible.value = false;
};

// 菜单抽屉显示隐藏 搭配inject函数使用 提供给navbar组件用于控制菜单显隐逻辑
provide('toggleDrawerMenu', () => {
  drawerVisible.value = !drawerVisible.value;
});
onMounted(() => {
  isInit.value = true;
});

//监听用户权限变化，如果没有访问路由的权限则重定向到403页面
watch(
  () => userStore.permissions,
  (permission) =>{
    if (permission && !permissions.accessRouter(route)) {
      router.push({ name: 'notFound' });
    }
  }
);

</script>

<style scoped lang="less">
@nav-size-height: 60px;
@layout-max-width: 1100px;

.layout {
  width: 100%;
  height: 100%;
}

.layout-navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: @nav-size-height;
}

.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  &::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: '';
  }

  > :deep(.arco-layout-sider-children) {
    overflow-y: hidden;
  }
}

.menu-wrapper {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  :deep(.arco-menu) {
    ::-webkit-scrollbar {
      width: 12px;
      height: 4px;
    }

    ::-webkit-scrollbar-thumb {
      border: 4px solid transparent;
      background-clip: padding-box;
      border-radius: 7px;
      background-color: var(--color-text-4);
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--color-text-3);
    }
  }
}

.layout-content {
  min-height: 100vh;
  overflow-y: hidden;
  background-color: var(--color-fill-2);
  transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}
</style>
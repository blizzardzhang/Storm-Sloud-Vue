<template>
  <div class="tab-bar-container">
    <a-affix ref="affixRef" :offset-top="offsetTop">
      <div class="tab-bar-box">
        <div class="tab-bar-scroll">
          <div class="tags-wrap">
            <tab-item
              v-for="(tag, index) in tagList"
              :key="tag.fullPath"
              :index="index"
              :tag="tag"
              :item-data="tag"
            />
          </div>
        </div>
         <!--操作按钮区域，暂时不实现-->
        <div class="tag-bar-operation"></div>
      </div>
    </a-affix>
  </div>
</template>
<script setup lang="ts">
import TabItem from "./tab-item.vue";
import { computed, onUnmounted, ref, watch } from 'vue'
import { useAppStore, useTabBarStore } from "@/store";
import { listenerRouteChange ,removeRouteListener } from "@/utils/route-listener.ts";
import type { RouteLocationNormalized } from "vue-router";

const appStore = useAppStore();
const tabBarStore = useTabBarStore();

// affix
const affixRef = ref();
// 顶部导航栏高度
const offsetTop = computed(() => {
  return appStore.navbar ? 60 : 0;
});
// 标签列表
const tagList = computed(() => {
  return tabBarStore.getTabList;
});

// 监听导航栏变化，更新 affix 位置
watch(
  () => appStore.navbar,
  () => {
    affixRef.value.updatePosition();
  },
);

listenerRouteChange((route: RouteLocationNormalized) => {
  if (
    !route.meta.noAffix &&
    !tagList.value.some((tag) => tag.fullPath === route.fullPath)
  ) {
    tabBarStore.updateTabList(route);
  }
}, true);

// 销毁监听器
onUnmounted(() => {
  removeRouteListener();
})


</script>

<style scoped lang="less">
.tab-bar-container {
  position: relative;
  background-color: var(--color-bg-2);

  .tab-bar-box {
    display: flex;
    padding: 0 0 0 20px;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);

    .tab-bar-scroll {
      height: 32px;
      flex: 1;
      overflow: hidden;

      .tags-wrap {
        padding: 4px 0;
        height: 48px;
        white-space: nowrap;
        overflow-x: auto;

        :deep(.arco-tag) {
          display: inline-flex;
          align-items: center;
          margin-right: 6px;
          cursor: pointer;

          &:first-child {
            .arco-tag-close-btn {
              display: none;
            }
          }
        }
      }
    }
  }

  .tag-bar-operation {
    width: 100px;
    height: 32px;
  }
}
</style>

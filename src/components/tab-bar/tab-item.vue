<template>
  <a-dropdown
    trigger="contextMenu"
    :popup-max-height="false"
    @select="actionSelect"
  >
    <span
      class="arco-tag arco-tag-size-medium arco-tag-checked"
      :class="{ 'link-activated': itemData.fullPath === $route.fullPath }"
      @click="goto(itemData)"
    >
      <span class="tag-link">
        {{ $t(itemData.title) }}
      </span>
      <span
        class="arco-icon-hover arco-tag-icon-hover arco-icon-hover-size-medium arco-tag-close-btn"
        @click.stop="tagClose(itemData, index)"
      >
        <icon-close />
      </span>
    </span>
    <template #content>
      <a-doption :disabled="disabledReload" :value="ActionType.reload">
        <icon-refresh />
        {{ $t("tag.reload") }}
      </a-doption>
      <a-doption
        class="sperate-line"
        :disabled="disabledCurrent"
        :value="ActionType.current"
      >
        <icon-close />
        <span>{{ $t("tag.closeCurrent") }}</span>
      </a-doption>
      <a-doption :disabled="disabledLeft" :value="ActionType.left">
        <icon-to-left />
        <span>{{ $t("tag.closeLeft") }}</span>
      </a-doption>
      <a-doption
        class="sperate-line"
        :disabled="disabledRight"
        :value="ActionType.right"
      >
        <icon-to-right />
        <span>{{ $t("tag.closeRight") }}</span>
      </a-doption>
      <a-doption :value="ActionType.others">
        <icon-swap />
        <span>{{ $t("tag.closeOther") }}</span>
      </a-doption>
      <a-doption :value="ActionType.all">
        <icon-folder-delete />
        <span>{{ $t("tag.closeAll") }}</span>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import type { TagProps } from "@/store/modules/tab-bar/types";
import { useTabBarStore } from "@/store";
import { computed, type PropType } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { DEFAULT_ROUTE_NAME, REDIRECT_ROUTE_NAME } from "@/router/constants.ts";

const { itemData, index } = defineProps({
  itemData: {
    type: Object as PropType<TagProps>,
    default() {
      return [];
    },
  },
  index: {
    type: Number,
    default: 0,
  },
});

enum ActionType {
  reload = "reload",
  current = "current",
  left = "left",
  right = "right",
  others = "others",
  all = "all",
}

const tabBarStore = useTabBarStore();
const route = useRoute();
const router = useRouter();

// 标签列表
const tagList = computed(() => {
  return tabBarStore.getTabList;
});

// 禁用刷新按钮
const disabledReload = computed(() => {
  return itemData.fullPath !== route.fullPath;
});

// 禁用关闭当前标签
const disabledCurrent = computed(() => {
  return index === 0;
});

// 禁用关闭左侧标签
const disabledLeft = computed(() => {
  return [0, 1].includes(index);
});

// 禁用关闭右侧标签
const disabledRight = computed(() => {
  return index === tagList.value.length - 1;
});

// 关闭标签
const tagClose = (tag: TagProps, idx: number) => {
  tabBarStore.deleteTag(idx, tag);
  if (itemData.fullPath === route.fullPath) {
    const latest = tagList.value[idx - 1]; // 获取队列的前一个tab
    router.push({ name: latest.name });
  }
};

// 获取当前路由的索引
const findCurrentRouteIndex = () => {
  return tagList.value.findIndex((item) => item.fullPath === route.fullPath);
};

// 标签操作
const actionSelect = async (value: any) => {
  const copyTagList = [...tagList.value];
  if (value === ActionType.current) {
    tagClose(itemData, index);
  } else if (value === ActionType.left) {
    const currentRouteIndex = findCurrentRouteIndex();
    copyTagList.splice(1, index - 1);
    tabBarStore.freshTabList(copyTagList);
    if (currentRouteIndex < index) {
      router.push({ name: itemData.name });
    }
  } else if (value === ActionType.right) {
    const currentRouteIndex = findCurrentRouteIndex();
    copyTagList.splice(index + 1);
    tabBarStore.freshTabList(copyTagList);
    if (currentRouteIndex > index) {
      router.push({ name: itemData.name });
    }
  } else if (value === ActionType.others) {
    const filterList = tagList.value.filter((_el, idx) => {
      return idx === 0 || idx === index;
    });
    tabBarStore.freshTabList(filterList);
    router.push({ name: itemData.name });
  } else if (value === ActionType.reload) {
    tabBarStore.deleteCache(itemData);
    await router.push({
      name: REDIRECT_ROUTE_NAME,
      params: {
        path: route.fullPath,
      },
    });
    tabBarStore.addCache(itemData.name);
  } else {
    tabBarStore.resetTabList();
    router.push({ name: DEFAULT_ROUTE_NAME });
  }
};

// 路由跳转
const goto = (tag: TagProps) => {
  router.push({ ...tag });
};
</script>

<style scoped lang="less">
.tag-link {
  color: var(--color-text-2);
  text-decoration: none;
}

.link-activated {
  color: rgb(var(--link-6));

  .tag-link {
    color: rgb(var(--link-6));
  }

  & + .arco-tag-close-btn {
    color: rgb(var(--link-6));
  }
}

:deep(.arco-dropdown-option-content) {
  span {
    margin-left: 10px;
  }
}

.arco-dropdown-open {
  .tag-link {
    color: rgb(var(--danger-6));
  }

  .arco-tag-close-btn {
    color: rgb(var(--danger-6));
  }
}

.sperate-line {
  border-bottom: 1px solid var(--color-neutral-3);
}
</style>

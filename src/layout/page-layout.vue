<template>
  <router-view v-slot="{Component,route}">
    <transition name="fade" mode="out-in" appear>
      <Component
        :is="Component"
        v-if="route.meta.ignoreCache"
        :key="route.fullPath"
        />
      <keep-alive v-else :include="cacheList">
        <component :is="Component" :key="route.fullPath"/>
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
  import { useTabBarStore } from '@/store'
  import { computed } from 'vue'

  const tabBarStore = useTabBarStore();
  const cacheList = computed(() => tabBarStore.getCacheList);
</script>



<style scoped lang="less">

</style>
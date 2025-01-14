<template>
<div class="container">
  <Breadcrumb :items="['menu.resource', 'menu.resource.ossConfig']"/>
</div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/breadcrumb/index.vue";
</script>



<style scoped lang="less">
@import '@/style/page.less';
</style>
<template>
  <div class="container">
    <Breadcrumb :items="['menu.user','menu.user.info']"/>
    <!--这里是用户信息页面内容-->
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '@/components/breadcrumb/index.vue';
</script>



<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

</style>
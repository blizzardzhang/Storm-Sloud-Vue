<template>
  <div>
    详情
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const articleId = route.query.id as string
</script>


<style scoped lang="less">

</style>
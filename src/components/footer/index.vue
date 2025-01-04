<template>
  <a-layout-footer class="footer">
    <span>
      Copyright © 2024-{{ new Date().getFullYear() }} Storm Cloud. All Rights Reserved
    </span>
  </a-layout-footer>
</template>
<script setup lang="ts"></script>

<style scoped lang="less">
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  color: var(--color-text-2);
  text-align: center;
}
</style>

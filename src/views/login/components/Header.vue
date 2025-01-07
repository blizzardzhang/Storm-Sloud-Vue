<template>
  <header class="login-header">
    <img :src=Logo alt="logo">
    <div class="operations-container">
      <a-button type="text" shape="square" variant="text" @click="navToGitHub">
        <IconGithub class="icon" />
      </a-button>
    </div>
  </header>
</template>

<script setup lang="ts">


import Logo from "@/assets/logo.svg";

const navToGitHub = () => {
  window.open('https://github.com/blizzardzhang');
};
</script>

<style lang="less" scoped>
.login-header {
  padding: 0 var(--td-comp-paddingLR-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  color: var(--td-text-color-primary);
  height: var(--td-comp-size-xxxl);

  .logo {
    width: 178px;
    height: var(--td-comp-size-s);
  }

  .operations-container {
    display: flex;
    align-items: center;

    .t-button {
      margin-left: var(--td-comp-margin-l);
    }
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';


import LoginHeader from './components/Header.vue';
import Login from './components/Login.vue';

const type = ref('login');
// const switchType = (val: string) => {
//   type.value = val;
// };
</script>

<template>
  <div class="login-wrapper">
    <login-header />

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">{{ $t('pages.login.loginTitle') }}</h1>
        <h1 class="title">Storm Cloud</h1>
<!--        <div class="sub-title">-->
<!--          <p class="tip">{{ type == 'register' ? $t('pages.login.existAccount') : $t('pages.login.noAccount') }}</p>-->
<!--          <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">-->
<!--            {{ type == 'register' ? $t('pages.login.signIn') : $t('pages.login.createAccount') }}-->
<!--          </p>-->
<!--        </div>-->
      </div>

      <login v-if="type === 'login'" />
<!--      <register v-else @register-success="switchType('login')" />-->
<!--      <tdesign-setting />-->
    </div>

    <div class="copyright">Copyright © 2024-{{ new Date().getFullYear() }} Blizzard. All Rights Reserved</div>
  </div>
</template>


<style lang="less" scoped>
@import './index.less';
</style>

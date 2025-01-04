<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import enUS from "@arco-design/web-vue/es/locale/lang/en-us";
import zhCN from "@arco-design/web-vue/es/locale/lang/zh-cn";
import useLocale from "@/hooks/locale.ts";
import { computed } from "vue";

const { currentLocale } = useLocale();
const locale = computed(() => {
  switch (currentLocale.value) {
    case "zh-CN":
      return zhCN;
    case "en-US":
      return enUS;
    default:
      return enUS;
  }
});
</script>

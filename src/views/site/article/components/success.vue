<template>
  <div class="success-wrap">
    <a-result
      status="success"
      :title="$t('common.submit.success')"
      :subtitle="$t('common.publish.success')"
    />
    <a-space :size="16">
      <a-button key="view" type="primary">
        {{$t('common.view')}}
      </a-button>
      <a-button key="again" type="secondary" @click="oneMore">
        {{$t('common.oneMore')}}
      </a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  const emits = defineEmits(['changeStep']);
  const oneMore = () => {
    emits('changeStep', 1);
  };
</script>

<style scoped lang="less">
  .success-wrap {
    text-align: center;
  }
  :deep(.arco-result) {
    padding-top: 0;
  }
</style>

<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      :label="$t('article.create.content')"
      field="content"
      :rules="[{ required: true,message: $t('article.create.content.placeholder')}]"
    >
      <a-textarea
        v-model="formData.content"
        :rows="10"
      ></a-textarea>
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{$t('common.forward')}}
        </a-button>
        <a-button type="primary">
          {{$t('common.preview')}}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{$t('common.publish')}}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>


</template>

<script setup lang="ts">

import type { FormInstance } from '@arco-design/web-vue'
import { ref } from 'vue'
import type { ContentModel } from '@/views/site/article/article-form.ts'

const emits = defineEmits(['changeStep']);

const formRef = ref<FormInstance>();
const formData = ref<ContentModel>({
  content: ''
})

// 下一步按钮点击事件
const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'submit', { ...formData.value });
  }
};
// 上一步按钮点击事件
const goPrev = () => {
  emits('changeStep', 'backward');
};

</script>



<style scoped lang="less">
.container {
  .keep-margin {
    margin-bottom: 20px;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}

.steps {
  margin-bottom: 36px;
}

.form {
  width: 540px;
}

.form-content {
  padding: 8px 50px 0 30px;
}

</style>
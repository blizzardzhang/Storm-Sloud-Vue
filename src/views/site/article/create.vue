<template>
  <div class="container">
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title> {{ $t("article.article.create") }} </template>
        <div class="wrapper">
          <a-steps
            style="width: 580px"
            line-less
            class="steps"
            v-model:current="step"
          >
            <a-step :description="$t('article.create.base')"> {{$t('article.create.base.fill')}} </a-step>
            <a-step :description="$t('article.create.edit')"> {{$t('article.create.edit.fill')}} </a-step>
            <a-step :description="$t('article.create.success')"> {{$t('article.create.success')}} </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo v-if="step === 1" @change-step="changeStep" />
            <ArtiContent v-else-if="step === 2" @change-step="changeStep" />
            <Success v-else-if="step === 3" @change-step="changeStep" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import BaseInfo from "./components/base-info.vue";
import ArtiContent from "./components/arti-content.vue";
import Success from "./components/success.vue";

import useLoading from "@/hooks/loading.ts";
import type { BaseInfoModel, ContentModel, ArticleModel } from "./article-form";
import { saveOrUpdateArticle } from "@/api/site/article.ts";

const { loading, setLoading } = useLoading(false);

const step = ref(1);
const submitModel = ref<ArticleModel>({} as ArticleModel);

const changeStep = (
  direction: string | number,
  model: BaseInfoModel | ContentModel,
) => {
  if (typeof direction === "number") {
    step.value = direction;
    return;
  }

  if (direction === "forward" || direction === "submit") {
    submitModel.value = {
      ...submitModel.value,
      ...model,
    };
    if (direction === "submit") {
      submitForm();
      return;
    }
    step.value += 1;
  } else if (direction === "backward") {
    step.value -= 1;
  }
};

const submitForm = async () => {
  setLoading(true);
  try {
    console.log("form", submitModel.value);
    //处理tags
    if (submitModel.value.tagListStr){
      submitModel.value.tags = submitModel.value.tagListStr.join(",");
    }
    const res = await saveOrUpdateArticle(submitModel.value);
    if (res.code === 200) {
      step.value = 3;
      submitModel.value = {} as ArticleModel; // init
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);

  :deep(.arco-form) {
    .arco-form-item {
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

.steps {
  margin-bottom: 76px;
}
</style>

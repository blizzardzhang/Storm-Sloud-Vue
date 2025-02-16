<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :rules="rules"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item field="type" :label="$t('article.type')" validate-trigger="blur" >
      <a-select v-model="type">
        <a-option value="1"> {{$t('article.category.tech')}} </a-option>
        <a-option value="2"> {{$t('article.category.life')}} </a-option>
      </a-select>
    </a-form-item>
    <a-form-item field="categoryId" :label="$t('article.category.name')" validate-trigger="blur">
      <a-select v-model="formData.categoryId" :placeholder="$t('article.create.category.placeholder')">
        <a-option v-for="item in categoryList" :value="item.id">
          {{ item.name }}
        </a-option>
      </a-select>
    </a-form-item>
    <a-form-item field="tags" :label="$t('article.tag.name')" validate-trigger="blur">
      <a-select v-model="formData.tagListStr" multiple :placeholder="$t('article.create.tag.placeholder')">
        <a-option v-for="item in tagList" :value="item.name">
          {{ item.name }}
        </a-option>
      </a-select>
    </a-form-item>
    <a-form-item field="title" :label="$t('article.create.title')" validate-trigger="blur">
      <a-input v-model="formData.title" :placeholder="$t('article.create.title.placeholder')"/>
    </a-form-item>
    <a-form-item field="description" :label="$t('article.create.desc')" validate-trigger="blur">
      <a-textarea v-model="formData.description" :placeholder="$t('article.create.desc.placeholder')" />
    </a-form-item>
    <a-form-item field="author" :label="$t('article.create.author')" validate-trigger="blur">
      <a-input v-model="formData.author" :placeholder="$t('article.create.author.placeholder')" />
    </a-form-item>
    <a-form-item field="coverImg" :label="$t('article.create.cover')" validate-trigger="blur">
      <s-upload
        @upload-success="handleUploadSuccess"
        />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
       {{$t('common.next')}}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { BaseInfoModel, Category, Tags } from '../article-form'
import { ref, watch } from 'vue'
import type { FormInstance } from "@arco-design/web-vue";
import { getArtiCategoryList } from "@/api/site/arti-category.ts";
import useLoading from "@/hooks/loading.ts";
import { getArtiTagList } from "@/api/site/arti-tag.ts";
import sUpload from "@/components/supload/index.vue";
import { useI18n } from 'vue-i18n'
const { setLoading } = useLoading(false);
const { t } = useI18n();


// 定义组件的props
const emits = defineEmits(['changeStep']);


const categoryList = ref<Category[]>([]);
const tagList = ref<Tags[]>([]);

const type = ref<string>('1');
const formRef = ref<FormInstance>();
const formData = ref<BaseInfoModel>({
  type: '1',
  title: "",
  description: "",
  author: "",
  categoryId: "",
  coverImg: "",
  tags: "",
  tagListStr: [],
  publishTime: "",
  location: "",
});

// 表单校验规则
const rules = {
  type: [{ required: true, message: t('article.create.type.placeholder')}],
  categoryId: [{ required: true, message: t('article.create.category.placeholder')}],
  title: [{ required: true, message: t('article.create.title.placeholder')}],
  description: [{ required: true, message: t('article.create.desc.placeholder')}],
  author: [{ required: true, message: t('article.create.author.placeholder')}],
  coverImg: [{ required: true, message: t('article.create.cover.placeholder')}]
};

//加载分类数据的方法
const loadCategories = async (type: string) => {
  setLoading(true);
  try {
    // 模拟异步加载数据，实际应用中应从后端获取
    const res = await getArtiCategoryList({ type: type });
    if (res.code === 200) {
      const data = res.data;
      if (type === "0") {
        categoryList.value = data;
      } else {
        categoryList.value = data.filter(
          (cat: Category) => cat.type === parseInt(type),
        );
      }
    }
  } catch (error) {
    console.error("加载分类失败:", error);
  } finally {
    setLoading(false);
  }
};

// 加载标签数据的方法
const loadTags = async (type: number) => {
  setLoading(true);
  try {
    // 模拟异步加载数据，实际应用中应从后端获取
    const res = await getArtiTagList({ type: type });
    if (res.code === 200) {
      tagList.value = res.data;
    }
  } catch (error) {
    console.error("加载标签失败:", error);
  } finally {
    setLoading(false);
  }
};

// 处理上传成功的事件，更新表单数据中的 coverImg 字段
const handleUploadSuccess = (data: any) => {
  formData.value.coverImg = data.id;
};

const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'forward', { ...formData.value });
  }
};

// 监听 type 变化，并加载分类和标签数据
watch(
  type,
  (newVal) => {
    loadCategories(newVal);
    loadTags(parseInt(newVal));
  },
  { immediate: true },
);
</script>

<style scoped lang="less">
.container {
  padding: 20px;
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
  width: 500px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
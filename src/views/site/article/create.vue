<template>
  <div class="article-create-container">
    <a-card class="article-form">
      <template #title> 新建文章 </template>
      <a-form :model="formData" @submit="handleSubmit">
        <a-form-item field="title" label="文章标题" required>
          <a-input v-model="formData.title" placeholder="请输入文章标题" />
        </a-form-item>

        <a-form-item field="type" label="文章类型" required>
          <a-radio-group v-model="formData.type" @change="handleTypeChange">
            <a-radio value="1">技术文章</a-radio>
            <a-radio value="2">生活小记</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item field="categoryId" label="文章分类" required>
          <a-select
            v-model="formData.categoryId"
            placeholder="请选择分类"
            allow-clear
          >
            <a-option
              v-for="category in categoryList"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="formData.type === '2'" field="location" label="位置">
          <a-input v-model="formData.location" placeholder="请输入位置" />
        </a-form-item>

        <a-form-item field="cover" label="封面图" required>
          <a-upload
            list-type="picture-card"
            :file-list="fileList"
            @change="handleImageChange"
          >
            <template #upload-button>
              <div>
                <icon-plus />
                <div>上传图片</div>
              </div>
            </template>
          </a-upload>
        </a-form-item>

        <a-form-item field="summary" label="文章摘要" required>
          <a-textarea
            v-model="formData.summary"
            placeholder="请输入文章摘要"
            :max-length="200"
            show-word-limit
          />
        </a-form-item>
        <a-form-item field="content" label="文章内容" required/>
        <editor
          :value="formData.content"
          :locale="zhHans"
          :plugins="plugins"
          :uploadImages="handleUploadImages"
          @change="handleEditorChange"
        />

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">发布文章</a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import "bytemd/dist/index.css";
import { Editor } from "@bytemd/vue-next";
import zhHans from "bytemd/lib/locales/zh_Hans.json";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import gemoji from "@bytemd/plugin-gemoji";

// 编辑器插件
const plugins = [gfm(), highlight(), mediumZoom(), gemoji()];

interface FormData {
  title: string;
  type: string;
  categoryId: string;
  location?: string;
  summary: string;
  content: string;
  cover: string;
}

const router = useRouter();
const fileList = ref([]);
const categoryList = ref([]);

const formData = ref<FormData>({
  title: "",
  type: "1",
  categoryId: "",
  location: "",
  summary: "",
  content: "",
  cover: "",
});

const loadCategories = async (type: string) => {
  try {
    // Mock数据，实际项目中替换为API调用
    const mockCategories = [
      { id: 1, name: "Vue", type: 1 },
      { id: 2, name: "React", type: 1 },
      { id: 3, name: "TypeScript", type: 1 },
      { id: 4, name: "旅行", type: 2 },
      { id: 5, name: "美食", type: 2 },
      { id: 6, name: "摄影", type: 2 },
    ];
    categoryList.value = mockCategories.filter(
      (cat) => cat.type === parseInt(type),
    );
  } catch (error) {
    console.error("加载分类失败:", error);
  }
};

const handleTypeChange = (value: string) => {
  formData.value.categoryId = "";
  loadCategories(value);
};

const handleImageChange = (fileList: any) => {
  // 处理图片上传，实际项目中需要处理文件上传逻辑
  console.log("fileList:", fileList);
};

// 处理编辑器图片上传
const handleUploadImages = async (files: File[]) => {
  try {
    // 这里实现图片上传逻辑
    // 示例返回格式：
    return files.map((file) => ({
      url: URL.createObjectURL(file),
      title: file.name,
      alt: file.name,
    }));
  } catch (error) {
    console.error("图片上传失败:", error);
    return [];
  }
};

// 处理编辑器内容变化
const handleEditorChange = (v: string) => {
  formData.value.content = v;
};

const handleSubmit = async () => {
  try {
    // 这里添加表单验证和提交逻辑
    if (!formData.value.content) {
      Message.error("请输入文章内容");
      return;
    }
    Message.success("发布成功");
    router.push({ name: "Article" });
  } catch (error) {
    console.error("发布文章失败:", error);
    Message.error("发布失败，请重试");
  }
};

const handleCancel = () => {
  router.back();
};

onMounted(async () => {
  loadCategories(formData.value.type);
});


</script>

<style scoped lang="less"></style>
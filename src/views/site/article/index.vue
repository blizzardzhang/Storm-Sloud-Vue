<template>
  <a-card class="article-container">
    <div class="header-container">
      <a-grid :cols="24" :colGap="16">
        <a-grid-item :span="24">
          <a-tabs v-model:activeKey="currentType" @change="handleTypeChange">
            <a-tab-pane key="0" :title="$t('article.category.all')" />
            <a-tab-pane key="1" :title="$t('article.category.tech')" />
            <a-tab-pane key="2" :title="$t('article.category.life')" />
          </a-tabs>
        </a-grid-item>
      </a-grid>
      <a-grid :cols="24" :colGap="16" style="margin-top: 16px">
        <a-grid-item :span="16">
          <a-select
            v-model="currentCategoryId"
            :placeholder="$t('article.category.select')"
            style="width: 200px"
            allow-clear
            @change="handleCategoryChange"
          >
            <a-option
              v-for="category in categoryList"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </a-option>
          </a-select>
        </a-grid-item>
        <a-grid-item :span="8">
          <a-input-search
            allow-clear
            v-model="searchKeyword"
            :placeholder="$t('article.article.search')"
            @search="handleSearch"
          />
        </a-grid-item>
      </a-grid>
    </div>

    <div class="article-list">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card
            class="article-item new-article-card"
            hoverable
            @click="handleCreateArticle"
          >
            <div class="new-article-content">
              <icon-plus-circle :size="48" />
              <p> {{ $t("article.article.create") }}</p>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6" v-for="article in articleList" :key="article.id">
          <a-card
            class="article-item"
            hoverable
            :bodyStyle="{ padding: '0' }"
            @click="handleArticleClick(article.id)"
          >
            <div class="article-cover">
              <img :src="article.coverImgUrl" :alt="article.title" />
            </div>
            <div class="article-main">
              <div class="article-tags">
                <a-tag color="blue">{{ article.categoryName }}</a-tag>
                <a-tag color="orange" v-for="item in article.tagList">
                  {{ item }}
                </a-tag>
                <a-tag v-if="article.location" color="green">
                  <icon-location />
                  {{ article.location }}
                </a-tag>
              </div>
              <div class="article-header">
                <h3 class="article-title">{{ article.title }}</h3>
                <a-button
                  type="text"
                  size="small"
                  @click.stop="handleEditArticle(article.id)"
                >
                  <icon-edit />
                </a-button>
              </div>
              <a-tooltip :content="article.description">
                <p class="article-summary">
                  {{ article.description }}
                </p>
              </a-tooltip>
              <div class="article-author">
                <span class="author-name">{{ article.author }}</span>
                <span class="publish-date">{{ article.publishTime }}</span>
              </div>
              <div class="article-stats">
                <span class="stat-item">
                  <icon-eye /> {{ article.views }}
                </span>
                <span class="stat-item">
                  <icon-thumb-up /> {{ article.likes }}
                </span>
                <span class="stat-item">
                  <icon-message /> {{ article.comments }}
                </span>
                <span class="stat-item">
                  <icon-share-alt /> {{ article.shares }}
                </span>
                <span class="stat-item">
                  <icon-star /> {{ article.stars }}
                </span>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div class="pagination-container">
      <a-pagination
        :total="pagination.total as number"
        v-model:current="pagination.current"
        :page-size="pagination.pageSize"
        @change="handlePageChange"
        show-total
      />
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import {
  IconEye,
  IconThumbUp,
  IconMessage,
  IconShareAlt,
  IconStar,
  IconLocation,
  IconPlusCircle,
  IconEdit,
} from "@arco-design/web-vue/es/icon";
import { getArtiCategoryList } from "@/api/site/arti-category.ts";
import useLoading from "@/hooks/loading.ts";
import { getArticlePage } from "@/api/site/article.ts";

const { setLoading } = useLoading(true);

interface Category {
  id: number;
  name: string;
  type: number; // 0: 全部, 1: 技术文章, 2: 生活小记
}

interface Article {
  id: number;
  type: number; // 0: 技术文章, 1: 生活小记
  title: string;
  author: string;
  description: string;
  content: string;
  categoryId: string;
  categoryName: string;
  coverImg: string;
  coverImgUrl: string;
  tags: string;
  tagList: string[];
  publishTime: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  stars: number;
  location?: string;
}

const router = useRouter();

const currentType = ref("0");
const currentCategoryId = ref<string>("");
const categoryList = ref<Category[]>([]);
const articleList = ref<Article[]>([]);
const searchKeyword = ref("");

// 分页
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 11,
});

//加载分类数据的方法
const loadCategories = async (type: string) => {
  setLoading(true);
  try {
    // 模拟异步加载数据，实际应用中应从后端获取
    const res = await getArtiCategoryList({ type: type });
    if (res.code === 200) {
      const data = res.data as Category[];
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

// 加载文章数据的方法
const loadArticles = async () => {
  setLoading(true);
  try {
    // 模拟异步加载数据，实际应用中应从后端获取
    const res = await getArticlePage({
      ...pagination,
      type: currentType.value,
      categoryId: currentCategoryId.value,
      title: searchKeyword.value,
    });
    if (res.code === 200) {
      articleList.value = res.data.records as Article[];
      pagination.current = res.data.current;
      pagination.total = res.data.total;
    }
  } finally {
    setLoading(false);
  }
};

// 修改类型切换处理方法
const handleTypeChange = (key: string | number) => {
  currentCategoryId.value = "";
  loadCategories(String(key));
  loadArticles();
};

// 修改分类切换处理方法
const handleCategoryChange = () => {
  loadArticles();
};

// 处理搜索
const handleSearch = () => {
  loadArticles();
};

const handlePageChange = (page: number) => {
  pagination.current = page;
  loadArticles();
};

const filteredArticles = ref<Article[]>([]);
// 新增：监听articleList的变化
watch(
  articleList,
  (newVal) => {
    filteredArticles.value = newVal;
  },
  { immediate: true },
);

// 新增：处理创建文章
const handleCreateArticle = () => {
  router.push({
    name: "ArticleCreate",
  });
};

// 处理文章卡片点击
const handleArticleClick = (id: number) => {
  router.push({
    name: "ArticleDetail",
    query: { id: String(id) },
  });
};

// 处理编辑文章
const handleEditArticle = (id: number) => {
  router.push({
    name: "ArticleEdit",
    query: { id: String(id) },
  });
};

// 初始加载全部分类
onMounted(() => {
  loadCategories("0");
  loadArticles();
});
</script>

<style scoped>
.article-container {
  margin: 16px;
}

.header-container {
  margin-bottom: 24px;
}

.article-item {
  margin-bottom: 16px;
  height: 100%;
}

.article-cover {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-item:hover .article-cover img {
  transform: scale(1.05);
}

.article-main {
  padding: 16px;
}

.article-tags {
  display: flex;
  margin-bottom: 12px;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.article-title {
  flex: 1;
  margin: 0;
  padding-right: 8px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-summary {
  color: #86909c;
  font-size: 14px;
  margin: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-author {
  display: flex;
  align-items: center;
  margin: 12px 0;
  gap: 8px;
}

.author-name {
  font-size: 14px;
  color: #4e5969;
}

.publish-date {
  font-size: 12px;
  color: #86909c;
  margin-left: auto;
}

.article-stats {
  display: flex;
  gap: 16px;
  color: #86909c;
  font-size: 13px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.new-article-card {
  height: 100%;
  cursor: pointer;
}

.new-article-content {
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-text-3);
}

.new-article-content p {
  margin-top: 16px;
  font-size: 16px;
}

.new-article-card:hover {
  color: rgb(var(--primary-6));
}

.new-article-card:hover :deep(.arco-icon) {
  color: rgb(var(--primary-6));
}
</style>

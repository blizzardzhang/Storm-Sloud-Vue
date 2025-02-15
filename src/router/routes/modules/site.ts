import type { AppRouteRecordRaw } from "@/router/routes/types.ts";
import { DEFAULT_LAYOUT } from "@/router/routes/base.ts";

const SITE: AppRouteRecordRaw = {
  path: "/site",
  name: "Site",
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    locale: "menu.site",
    icon: "icon-dashboard",
    order: 0,
  },
  children: [
    {
      path: "articles",
      name: "Article",
      component: () => import("@/views/site/article/index.vue"),
      meta: {
        title: "文章管理",
        locale: "menu.site.article",
        requiresAuth: true,
      },
    },
    {
      path: "create-article",
      name: "ArticleCreate",
      component: () => import("@/views/site/article/create.vue"),
      meta: {
        title: "新建文章",
        locale: "menu.site.article.create",
        requiresAuth: true,
      },
    },
    {
      path: "edit-article",
      name: "ArticleEdit",
      component: () => import("@/views/site/article/edit.vue"),
      meta: {
        locale: "menu.site.article.edit",
        requiresAuth: true,
      },
    },
    {
      path: "article-detail",
      name: "ArticleDetail",
      component: () => import("@/views/site/article/detail.vue"),
      meta: {
        locale: "menu.site.article.detail",
        requiresAuth: true,
      },
    },
    {
      path: "arti-tag",
      name: "ArtiTag",
      component: () => import("@/views/site/arti-tags/index.vue"),
      meta: {
        locale: "menu.site.artiTag",
        requiresAuth: true,
        permission: "/site/artiTag",
      },
    },
    {
      path: "arti-category",
      name: "ArtiCategory",
      component: () => import("@/views/site/arti-category/index.vue"),
      meta: {
        locale: "menu.site.artiCategory",
        requiresAuth: true,
        permission: "/site/artiCategory",
      },
    },
  ],
};
export default SITE;

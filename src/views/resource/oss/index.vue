<template>
<div class="container">
  <Breadcrumb :items="['menu.resource', 'menu.resource.oss']" />
  <a-card class="general-card" :title="$t('resource.oss.list')">
    <!--水平分割线-->
    <a-divider style="margin-top: 0" />
    <!--按钮区域-->
    <a-row style="margin-bottom: 16px">
      <!--左侧按钮区域-->
      <a-col :span="12">
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t("button.create") }}
          </a-button>
          <a-popconfirm
            type="warning"
            :content="$t('common.pop.delete')"
            @cancel="
                () => {
                  Message.info(t('common.cancelled'));
                }
              "
            @ok="handleDelete"
          >
            <a-button type="primary" status="danger">
              <template #icon>
                <icon-delete />
              </template>
              {{ $t("button.delete") }}
            </a-button>
          </a-popconfirm>
        </a-space>
      </a-col>
      <!--右侧按钮区域-->
      <a-col
        :span="12"
        style="display: flex; align-items: center; justify-content: end"
      >
        <!--刷新-->
        <a-tooltip :content="$t('button.refresh')">
          <div class="action-icon" @click="refresh">
            <icon-refresh size="18" />
          </div>
        </a-tooltip>
        <!--密度-->
        <a-dropdown @select="handleSelectDensity">
          <a-tooltip :content="$t('table.actions.density')">
            <div class="action-icon">
              <icon-line-height size="18" />
            </div>
          </a-tooltip>
          <template #content>
            <a-doption
              v-for="item in densityList"
              :key="item.value"
              :value="item.value"
              :class="{ active: item.value === size }"
            >
              <span>{{ item.name }}</span>
            </a-doption>
          </template>
        </a-dropdown>
      </a-col>
    </a-row>
  </a-card>
</div>
</template>

<script setup lang="ts">

import Breadcrumb from '@/components/breadcrumb/index.vue';
import { Message, type TableRowSelection } from '@arco-design/web-vue'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type SizeProps = "mini" | "small" | "medium" | "large";

const { t } = useI18n();

//密度
const size = ref<SizeProps>("medium");
// 表格密度选择
const densityList = computed(() => [
  {
    name: t("table.size.mini"),
    value: "mini",
  },
  {
    name: t("table.size.small"),
    value: "small",
  },
  {
    name: t("table.size.medium"),
    value: "medium",
  },
  {
    name: t("table.size.large"),
    value: "large",
  },
]);
// 改变表格密度
const handleSelectDensity = (
  val: string | number | Record<string, any> | undefined,
  _e: Event,
) => {
  size.value = val as SizeProps;
};

// 表格选择项配置
const rowSelection = reactive<TableRowSelection>({
  type: "checkbox",
  showCheckedAll: true,
  checkStrictly: true,
});
// 表格选中
const selectedKeys = ref([]);

</script>



<style scoped lang="less">
@import "@/style/page.less";
</style>
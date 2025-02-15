<template>
  <div class="container">
    <Breadcrumb :items="['menu.site', 'menu.site.artiTag']" />
    <a-card class="general-card" :title="$t('site.artiTag.list')">
      <!--筛选条件-->
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 2 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="8">
              <a-col :span="12">
                <a-form-item filed="type" :label="$t('artiTag.table.type')">
                  <a-select
                    v-model="formModel.type"
                    allow-clear
                    :placeholder="$t('artiTag.table.type.placeholder')"
                  >
                    <a-option value = "1">技术文章分类</a-option>
                    <a-option value = "2">生活小记分类</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item filed="name" :label="$t('artiTag.table.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('artiTag.table.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <!--竖直分割线-->
        <a-divider style="height: 42px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t("button.search") }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
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
              @ok="handleDelete()"
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
            <div class="action-icon" @click="search">
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
      <!--表格-->
      <a-table
        rowKey="id"
        :loading="loading"
        :pagination="false"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="size"
        v-model:selected-keys="selectedKeys"
        :row-selection="rowSelection"
      >
        <template #type="{ record }">
<!--          如果type =1 显示技术 type =2 显示生活-->
          <a-tag color="green" v-if="record.type === 1">技术文章分类</a-tag>
          <a-tag color="green" v-else>生活小记分类</a-tag>
        </template>
        <template #actions="{ record }">
          <a-space>
            <a-button
              type="text"
              shape="round"
              @click="handleEdit(record)"
            >
              <template #icon>
                <icon-edit />
              </template>
              {{ $t("button.edit") }}
            </a-button>
          </a-space>
        </template>
      </a-table>
      <div class="page-wrapper">
        <a-pagination
          :total="pagination.total as number"
          v-model:current="pagination.current"
          :page-size="pagination.pageSize"
          @change="onPageChange"
          @page-size-change="onPageSizeChange"
          show-total
          show-page-size
        />
      </div>
    </a-card>

    <!--新增和编辑弹窗-->
    <a-modal
      v-model:visible="modalVisible"
      width="auto"
      @cancel="cancelModal"
      :footer="false"
     :title="
      isEdit
      ? $t('site.artiTag.modal.title.edit')
      : $t('site.artiTag.modal.title.create')
    "
    >
      <a-form
        ref="formRef"
        :style="{ width: '600px' }"
        auto-label-width
        :model="formData"
        :rules="rules"
        @submit="handleSubmit"
        size="large"
      >
        <a-form-item
          field="type"
          :label="$t('artiTag.table.type') "
          validate-trigger="blur"
          required
        >
          <a-select
            v-model="formData.type"
            allow-clear
            :placeholder="$t('artiTag.table.type.placeholder')"
          >
            <a-option value = "1">技术文章分类</a-option>
            <a-option value = "2">生活小记分类</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          field="name"
          :label="$t('artiTag.table.name') "
          validate-trigger="blur"
          required
        >
          <a-input
            v-model="formData.name"
            :placeholder="$t('artiTag.table.name.placeholder')"  />
<!--          <template #extra>-->
<!--            <div>Used to login</div>-->
<!--          </template>-->
        </a-form-item>

        <!--确定和取消按钮，在modal垂直和水平居中 按钮之间有一定间隔-->
        <a-space style="margin-top: 16px; justify-content: center">
          <a-button type="primary" status="warning" @click="cancelModal">
            {{ $t("button.cancel") }}
          </a-button>
          <a-button type="primary" html-type="submit">
            {{ $t("button.confirm") }}
          </a-button>
        </a-space>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">

import Breadcrumb from '@/components/breadcrumb/index.vue'
import { Message, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading.ts'
import { computed, reactive, ref } from 'vue'
import { deleteArtiTag, getArtiTagPage, saveOrUpdateArtiTag } from '@/api/site/arti-tag.ts'


const { t } = useI18n();
//loading
const { loading, setLoading } = useLoading(true);
type SizeProps = "mini" | "small" | "medium" | "large";

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

//model
const INITIAL_DATA = {
 type: '',
 name: '',
};

const modalVisible = ref(false);
const isEdit = ref(false);
const formData = ref({ ...INITIAL_DATA });
const formRef = ref();

//新增
const handleCreate = () => {
  modalVisible.value = true;
  isEdit.value = false;
};
//编辑
const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(formData.value, {
    ...record,
    type: record.type.toString(), // 将 type 转换为字符串
  })
  modalVisible.value = true;
};

// 生成表单数据筛选模型
const generateFormModel = () => {
  return {
    name: '',
    type: '',
  };
};
// 筛选表单数据模型
const formModel = ref(generateFormModel());


// 表格选择项配置
const rowSelection = reactive<TableRowSelection>({
  type: "checkbox",
  showCheckedAll: true,
  checkStrictly: true,
});
// 表格选中
const selectedKeys = ref([]);

const columns: TableColumnData[] = [
  {
    title: t("artiTag.table.type"),
    dataIndex: "type",
    fixed: "left",
    width: 120,
    slotName: "type",
  },
  {
    title: t("artiTag.table.name"),
    dataIndex: "name",
    width: 100,
  },
  {
    title: t("common.table.actions"),
    slotName: "actions",
    fixed: "right",
    width: 100,
  },
];

// 表格数据
const renderData = ref([]);

// 分页
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
});

//获取数据
const fetchData = async(
  params = {
    ...pagination
  },
) =>{
  setLoading(true);
  try{
    const res = await getArtiTagPage(params);
    if (res.code === 200){
      pagination.current = res.data.current;
      pagination.total = res.data.total;
      renderData.value = res.data.records;
    }
  }finally {
    setLoading(false);
  }
}

fetchData();

//搜索、刷新按钮
const search = () => {
  fetchData({ ...pagination, ...formModel.value });
};


//删除
const handleDelete = async () => {
  setLoading(true);
  const selected = selectedKeys.value;
  if (!selected.length) {
    Message.warning(t("common.nothing.selected"));
    setLoading(false);
    return;
  }
  try {
    const params = {
      ids: selected.join(","),
    };
    const res = await deleteArtiTag(params);
    if (res.code === 200) {
      Message.success(t("common.success"));
    } else {
      Message.error(t("common.fail"));
    }
  } finally {
    await fetchData();
    setLoading(false);
  }
};

// 分页改变
const onPageChange = (current: number) => {
  pagination.current = current;
  fetchData({ ...pagination });
};
// 分页大小改变
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  fetchData({ ...pagination });
};

const rules = {
  type: [{ required: true, message: t("artiTag.rules.type.required") }],
  name: [{ required: true, message: t("artiTag.rules.name.required") }],
}

//新增或者编辑
const handleSubmit = async () => {
  setLoading(true);

  const valid = await formRef.value.validate();
  if (valid) return;
  try {
    const data = {
      ...formData.value,
      type: Number(formData.value.type), // 将 type 转换为数字
    };
    const res = await saveOrUpdateArtiTag(data);
    if (res.code === 200) {
      Message.success(t("common.success"));
    } else {
      Message.error(t("common.fail"));
    }
  } finally {
    clearForm();
    await fetchData();
    setLoading(false);
  }
};

//取消或者关闭弹窗
const cancelModal = () => {
  clearForm();
};

//清空表单数据、关闭弹窗
const clearForm = () => {
  formRef.value.resetFields();
  formData.value = {...INITIAL_DATA};
  modalVisible.value = false;
};

</script>



<style scoped lang="less">

@import "@/style/page.less";
</style>
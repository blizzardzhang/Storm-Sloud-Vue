<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.menu']" />
    <a-card class="general-card" :title="$t('menu.system.menu')">
      <!--筛选条件-->
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="name" :label="$t('system.menu.table.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('system.menu.table.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="title"
                  :label="$t('system.menu.table.title')"
                >
                  <a-input
                    v-model="formModel.title"
                    :placeholder="$t('system.menu.table.title.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="permission"
                  :label="$t('system.menu.table.permission')"
                >
                  <a-input
                    v-model="formModel.permission"
                    :placeholder="
                      $t('system.menu.table.permission.placeholder')
                    "
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
            <a-button type="primary" @click="createNew">
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
            <div class="action-icon" @click="refreshData">
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
      <!--表格区域-->
      <a-table
        row-key="id"
        :loading="loading"
        :columns="columns as TableColumnData[]"
        :data="renderData"
        :bordered="false"
        :size="size"
        v-model:selected-keys="selectedKeys"
        :row-selection="rowSelection"
        show-empty-tree
        :pagination="false"
      >
        <template #category="{record}">
          <a-tag color="green" v-if="record.category === 1">
            {{ $t("common.menu")  }}
          </a-tag>
          <a-tag color="green" v-else>
            {{ $t("common.button") }}
          </a-tag>
        </template>
        <template #activeMenu="{record}">
          <a-tag color="red" v-if="record.activeMenu === 0">
            {{ $t("common.no")  }}
          </a-tag>
          <a-tag color="green" v-else>
            {{ $t("common.yes") }}
          </a-tag>
        </template>
        <template #noAffix="{record}">
          <a-tag color="red" v-if="record.noAffix === 0">
            {{ $t("common.no")  }}
          </a-tag>
          <a-tag color="green" v-else>
            {{ $t("common.yes") }}
          </a-tag>
        </template>
        <template #ignoreCache="{record}">
          <a-tag color="red" v-if="record.ignoreCache === 0">
            {{ $t("common.no")  }}
          </a-tag>
          <a-tag color="green" v-else>
            {{ $t("common.yes") }}
          </a-tag>
        </template>
        <template #actions="{record}">
          <a-space>
            <a-button type="text" shape="round" @click="editData(record)">
              <template #icon>
                <icon-edit />
              </template>
              {{ $t("button.edit") }}
            </a-button>
            <a-button
              type="text"
              shape="round"
              @click="createChild(record)"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t("button.create.children") }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!--抽屉-->
    <a-modal
      v-model:visible="modalVisible"
      :footer="false"
      width="auto"
      @before-open="beforeModalOpen"
      @cancel="cancelModal"
      :title="isEdit ? $t('button.edit') : $t('button.create')"
    >
      <a-form
        ref="formRef"
        :rules="rules"
        :style="{ width: '900px' }"
        auto-label-width
        :model="formData"
        @submit="submitForm"
        size="large"
      >
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="parentId"
              :label="$t('system.menu.table.parent')"
              validate-trigger="blur"
              label-col-flex="100px"
            >
              <a-tree-select
                v-model="formData.parentId"
                :data="treeData as TreeNodeData[]"
                :placeholder="$t('menu.placeholder.parentId')"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="name"
              :label="$t('system.menu.table.name')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('menu.placeholder.name')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="title"
              :label="$t('system.menu.table.title')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input
                v-model="formData.title"
                :placeholder="$t('menu.placeholder.title')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="icon"
              :label="$t('system.menu.table.icon')"
              validate-trigger="blur"
              label-col-flex="100px"
            >
              <a-input
                v-model="formData.icon"
                :placeholder="$t('menu.placeholder.icon')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="code"
              :label="$t('system.menu.table.code')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input
                v-model="formData.code"
                :placeholder="$t('menu.placeholder.code')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="permission"
              :label="$t('system.menu.table.permission')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input
                v-model="formData.permission"
                :placeholder="$t('menu.placeholder.permission')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="locale"
              :label="$t('system.menu.table.locale')"
              validate-trigger="blur"
              label-col-flex="100px"
            >
              <a-input
                v-model="formData.locale"
                :placeholder="$t('menu.placeholder.locale')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="sort"
              :label="$t('system.menu.table.sort')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input-number
                v-model="formData.sort"
                :placeholder="$t('menu.placeholder.sort')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="category"
              :label="$t('system.menu.table.category')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-radio-group v-model="formData.category">
                <a-radio :value=1>{{ $t("common.menu") }}</a-radio>
                <a-radio :value=2>{{ $t("common.button") }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="noAffix"
              :label="$t('system.menu.table.noAffix')"
              validate-trigger="blur"
              label-col-flex="100px"
            >
              <a-radio-group v-model="formData.noAffix">
                <a-radio :value=1>{{ $t("common.yes") }}</a-radio>
                <a-radio :value=0>{{ $t("common.no") }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="activeMenu"
              :label="$t('system.menu.table.activeMenu')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-radio-group v-model="formData.activeMenu">
                <a-radio :value=1>{{ $t("common.yes") }}</a-radio>
                <a-radio :value=0>{{ $t("common.no") }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="ignoreCache"
              :label="$t('system.menu.table.ignoreCache')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-radio-group v-model="formData.ignoreCache">
                <a-radio :value=1>{{ $t("common.yes") }}</a-radio>
                <a-radio :value=0>{{ $t("common.no") }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
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
import Breadcrumb from "@/components/breadcrumb/index.vue";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import {
  Message,
  type TableColumnData,
  type TableRowSelection,
  type TreeNodeData,
} from "@arco-design/web-vue";
import type { SysMenu } from "@/types/global.ts";
import {
  deleteMenu,
  menuTreeSelect,
  menuTree,
  saveOrUpdateMenu,
} from "@/api/sys/menu.ts";

type SizeProps = "mini" | "small" | "medium" | "large";

// 生成表单数据模型
const generateFormModel = () => {
  return {
    name: "",
    title: "",
    permission: "",
  };
};
// 筛选表单数据模型
const formModel = ref(generateFormModel());
const { t } = useI18n();
//loading
const { loading, setLoading } = useLoading(true);
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
// 表格列
const columns: TableColumnData[] = [
  {
    title: t("system.menu.table.name"),
    dataIndex: "name",
    fixed: "left",
    width: 140,
  },
  {
    title: t("system.menu.table.title"),
    dataIndex: "title",
  },
  {
    title: t("system.menu.table.code"),
    dataIndex: "code",
  },
  {
    title: t("system.menu.table.permission"),
    dataIndex: "permission",
  },
  {
    title: t("system.menu.table.icon"),
    dataIndex: "icon",
  },
  {
    title: t("system.menu.table.locale"),
    dataIndex: "locale",
  },
  {
    title: t("system.menu.table.category"),
    dataIndex: "category",
    slotName: "category",
  },
  {
    title: t("system.menu.table.activeMenu"),
    dataIndex: "activeMenu",
    slotName: "activeMenu",
  },
  {
    title: t("system.menu.table.noAffix"),
    dataIndex: "noAffix",
    slotName: "noAffix",
  },
  {
    title: t("system.menu.table.ignoreCache"),
    dataIndex: "ignoreCache",
    slotName: "ignoreCache",
  },
  {
    title: t("system.menu.table.sort"),
    dataIndex: "sort",
    width: 100,
  },
  {
    title: t("common.table.actions"),
    slotName: "actions",
    fixed: "right",
    width: 140,
  },
];
// 表格数据
const renderData = ref<SysMenu[]>([]);
// 表格选择项配置
const rowSelection = reactive<TableRowSelection>({
  type: "checkbox",
  showCheckedAll: true,
  checkStrictly: true,
});
// 表格选中
const selectedKeys = ref([]);

// 改变表格密度
const handleSelectDensity = (
  val: string | number | Record<string, any> | undefined,
  _e: Event,
) => {
  size.value = val as SizeProps;
};

//modal
const INITIAL_DATA = {
  id: '',
  parentId: '',
  name: '',
  title: '',
  code: '',
  activeMenu: 0,
  permission: '',
  locale: '',
  icon: '',
  sort: 1,
  category: 1,
  ignoreCache: 0,
  noAffix: 0,
};

const modalVisible = ref(false);
const isEdit = ref(false);
const formData = ref({ ...INITIAL_DATA });
const formRef = ref();

// 表格数据获取
const fetchData = async (param: { name: ""; title: ""; permission: "" }) => {
  setLoading(true);
  try {
    const { data } = await menuTree(param);
    renderData.value = data;
  } finally {
    setLoading(false);
  }
};
fetchData({ ...formModel.value } as any);

//搜索
const search = () => {
  fetchData({ ...formModel.value } as any);
};
// 刷新数据
const refreshData = async () => {
  await fetchData({ ...formModel.value } as any);
};

// 删除数据
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
    const res = await deleteMenu(params);
    if (res.code === 200) {
      Message.success(t("common.success"));
    }else {
      Message.error(t("common.fail"));
    }
  } finally {
    await fetchData({ ...formModel.value } as any);
    setLoading(false);
  }
};

//modal
//表单验证规则
const rules = {
  parentId: [{ required: true, message: t("menu.placeholder.parentId") }],
  name: [{ required: true, message: t("menu.placeholder.name") }],
  title: [{ required: true, message: t("menu.placeholder.title") }],
  code: [{ required: true, message: t("menu.placeholder.code") }],
  permission: [{ required: true, message: t("menu.placeholder.permission") }],
  icon: [{ required: true, message: t("menu.placeholder.icon") }],
  category: [{ required: true, message: t("menu.placeholder.category") }],
  sort: [{ required: true, message: t("menu.placeholder.sort") }],
  locale: [{ required: true, message: t("menu.placeholder.locale") }],
  activeMenu: [{ required: true, message: t("menu.placeholder.activeMenu") }],
  ignoreCache: [{ required: true, message: t("menu.placeholder.ignoreCache") }],
  noAffix: [{ required: true, message: t("menu.placeholder.noAffix") }],
};
// 新增
const createNew = () => {
  modalVisible.value = true;
  isEdit.value = false;
};

//编辑
const editData = (record: any) => {
  isEdit.value = true;
  Object.assign(formData.value, record);
  modalVisible.value = true;
};

//新增子项
const createChild = (record: any) => {
  isEdit.value = false;
  formData.value.parentId = record.id;
  modalVisible.value = true;
};

//提交对话框表单
const submitForm = async () => {
  setLoading(true);
  try {
    const valid = await formRef.value.validate();
    if (valid) return;
    const res = await saveOrUpdateMenu(formData.value);
    if (res.code === 200) {
      Message.success(t('common.success'));
    } else {
      Message.error(t('common.fail'));
    }
  } finally {
    clearForm();
    await refreshData();
    setLoading(false);
  }
};
//树形控件数据
type TreeDataType = {
  key: string;
  title: string;
  children?: TreeDataType[];
};
const rootData: TreeDataType = {
  key: "0",
  title: t("menu.root"),
};
const treeData = ref<TreeDataType[]>([]);
// 打开弹窗前操作
const beforeModalOpen = async () => {
  const { data } = await menuTreeSelect();
  // 组装树形控件数据 国际化
  data.forEach((item: any) => {
    const title = t(`${item.title}`);
    if (item.children && item.children.length) {
      item.children.forEach((child: any) => {
        child.title = t(`${child.title}`);
      });
    }
    item.title = title;
  });
  treeData.value = data;
  //将顶级菜单放入
  treeData.value.unshift(rootData);
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
@import '@/style/page.less';
</style>

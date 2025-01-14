<template>
  <div class="container">
    <BreadCrumb :items="['menu.system', 'menu.system.role']" />
    <a-card class="general-card" :title="$t('system.role.list')">
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
      <!--表格-->
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="false"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="size"
        v-model:selected-keys="selectedKeys"
        :row-selection="rowSelection"
      >
        <!--状态处理-->
        <template #isEnable="{ record }">
          <span v-if="record.isEnable === 1" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`role.table.isEnable.${record.isEnable}`) }}
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
            <a-button
              type="text"
              shape="round"
              @click="openGrant(record.id)"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t("button.grantMenu") }}
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
<!--    新增或者修改drawer-->
    <a-drawer
      v-model:visible="drawerVisible"
      width="450px"
      :mask-closable="false"
      @ok="handleSubmit"
      @cancel="cancelDrawer"
      :title="isEdit ? $t('role.title.edit') : $t('role.title.create')"
    >
      <a-form
        ref="formRef"
        auto-label-width
        :rules="formRules"
        :model="formData"
        :style="{ width: '400px' }"
      >
        <a-form-item
          field="name"
          :label="$t('role.table.name')"
          validate-trigger="blur"
        >
          <a-input
            v-model="formData.name"
            :placeholder="$t('role.placeholder.name')"
          />
        </a-form-item>
        <a-form-item
          field="code"
          :label="$t('role.table.code')"
          validate-trigger="blur"
        >
          <a-input
            v-model="formData.code"
            :placeholder="$t('role.placeholder.code')"
          />
        </a-form-item>
        <a-form-item
          field="sort"
          :label="$t('role.table.sort')"
          validate-trigger="blur"
        >
          <a-input-number
            v-model="formData.sort"
            mode="button"
            :placeholder="$t('role.placeholder.sort')"
          />
        </a-form-item>
        <a-form-item
          field="isEnable"
          :label="$t('role.table.isEnable')"
          validate-trigger="blur"
        >
          <a-radio-group v-model="formData.isEnable">
            <a-radio :value=0>{{ $t("role.table.isEnable.0") }}</a-radio>
            <a-radio :value=1>{{ $t("role.table.isEnable.1") }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          field="remark"
          :label="$t('role.table.remark')"
        >
          <a-textarea
            v-model="formData.remark"
            :placeholder="$t('role.placeholder.remark')"
          >
          </a-textarea>
        </a-form-item>
      </a-form>
    </a-drawer>
    <!--授权modal-->
    <a-modal
      :mask-closable="false"
      v-model:visible="modalVisible"
      @ok="handleGrantSubmit"
      @cancel="cancelModal"
      width="auto"
    >
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" :title="$t('role.modal.tag.menuPermission')">
          <a-tree
            :checkable="true"
            v-model:checked-keys="selectedMenu"
            :data="menuTreeData as TreeNodeData[]"
          />
        </a-tab-pane>
        <a-tab-pane key="2" :title="$t('role.modal.tag.apiPermission')">

        </a-tab-pane>
      </a-tabs>

    </a-modal>

  </div>
</template>

<script setup lang="ts">
import BreadCrumb from "@/components/breadcrumb/index.vue";
import {
  Message,
  type TableColumnData,
  type TableRowSelection, type TreeNodeData,
} from '@arco-design/web-vue'
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading.ts";
import { computed, reactive, ref } from "vue";
import { deleteRole, getRoleDetail, getRolePage, grantRole, saveOrUpdateRole } from '@/api/role.ts'
import { menuTreeSelect } from '@/api/menu.ts'

type SizeProps = "mini" | "small" | "medium" | "large";

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

// 表格列配置
const columns: TableColumnData[] = [
  {
    title: t("role.table.name"),
    dataIndex: "name",
    fixed: "left",
    width: 150,
  },
  {
    title: t("role.table.code"),
    dataIndex: "code",
  },
  {
    title: t("role.table.type"),
    dataIndex: "type",
  },
  {
    title: t("role.table.sort"),
    dataIndex: "sort",
  },
  {
    title: t("role.table.isEnable"),
    dataIndex: "isEnable",
    slotName: "isEnable",
  },
  {
    title: t("role.table.remark"),
    dataIndex: "remark",
  },
  {
    title: t("common.table.actions"),
    slotName: "actions",
    fixed: "right",
    width: 140,
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
const fetchData = async (
  params = {
    ...pagination,
  },
) => {
  setLoading(true);
  try {
    const { data } = await getRolePage(params);
    pagination.current = data.current;
    pagination.total = data.total;
    renderData.value = data.records;
  } finally {
    setLoading(false);
  }
};
fetchData();

//刷新
const refresh = () => {
  fetchData({ ...pagination });
};

//drawer
const INITIAL_DATA = {
  id: '',
  name: '',
  code: '',
  sort: 0,
  remark: '',
  isEnable: 0,
};
const drawerVisible = ref(false);
const isEdit = ref(false);
const formData = ref({ ...INITIAL_DATA });
const formRef = ref();

const formRules = {
  name: [{ required: true, message: t("role.placeholder.name") },],
  code: [{ required: true, message: t("role.placeholder.code") },],
  sort: [{ required: true, message: t("role.placeholder.sort") },],
  isEnable: [{ required: true, message: t("role.placeholder.isEnable") },],
};

//授权modal
const roleId = ref('');
const modalVisible = ref(false);
const selectedMenu = ref<string[]>([]);

//树形控件数据
type TreeDataType = {
  key: string;
  title: string;
  children?: TreeDataType[];
};
const menuTreeData = ref<TreeDataType[]>([]);
const loadMenuTree = async () => {
  const { data } = await menuTreeSelect();
  data.forEach((item: any) => {
    const title = t(`${item.title}`);
    if (item.children && item.children.length) {
      item.children.forEach((child: any) => {
        child.title = t(`${child.title}`);
      });
    }
    item.title = title;
  });
  menuTreeData.value = data;
}



//新增
const handleCreate = () => {
  drawerVisible.value = true;
  isEdit.value = false;
};
// 编辑
const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(formData.value, record);
  drawerVisible.value = true;
};

// 提交
const handleSubmit = async () => {
  setLoading(true);
  try {
    const valid = await formRef.value.validate();
    if (valid) return;
    const res = await saveOrUpdateRole(formData.value);
    if (res.code === 200) {
      Message.success(t("common.success"));
    }else {
      Message.error(t("common.fail"));
    }
  }finally {
    clearForm();
    await fetchData();
    setLoading(false);
  }
}

// 授权
const openGrant = async (id: any) => {
  modalVisible.value = true;
  roleId.value = id;
  //查询该角色拥有的权限
  const res = await getRoleDetail({id: id});
  if (res.code === 200) {
    selectedMenu.value = res.data.menus.map((item: { id: string }) => item.id) as string[];
  }
  await loadMenuTree();
};


//提交授权
const handleGrantSubmit = async () => {
  setLoading(true);
  try {
    const params = {
      roleId: roleId.value,
      menuIds: selectedMenu.value.join(","),
    };
    const res = await grantRole(params);
    if (res.code === 200) {
      Message.success(t("common.success"));
    } else {
      Message.error(t("common.fail"));
    }
  } finally {
    cancelModal();
    await fetchData();
    setLoading(false);
  }
};

//关闭modal
const cancelModal = () => {
  modalVisible.value = false;
  roleId.value = '';
  selectedMenu.value = [];
};

// 删除
const handleDelete = async() => {
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
    const res = await deleteRole(params);
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

//取消或者关闭弹窗
const cancelDrawer = () => {
  clearForm();
};

//清空表单数据、关闭弹窗
const clearForm = () => {
  formRef.value.resetFields();
  formData.value = { ...INITIAL_DATA };
  drawerVisible.value = false;
};
</script>

<style scoped lang="less">
@import "@/style/page.less";

.form-input {
  background-color: #ffffff; /* 设置背景颜色为白色 */
}
</style>
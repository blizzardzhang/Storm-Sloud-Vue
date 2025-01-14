<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <a-card class="general-card" :title="$t('system.user.list')">
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
                <a-form-item filed="name" :label="$t('user.table.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('user.table.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item filed="account" :label="$t('user.table.account')">
                  <a-input
                    v-model="formModel.account"
                    :placeholder="$t('user.table.account.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item filed="phone" :label="$t('user.table.phone')">
                  <a-input
                    v-model="formModel.phone"
                    :placeholder="$t('user.table.phone.placeholder')"
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
        row-key="id"
        :scroll="scroll"
        :loading="loading"
        :pagination="false"
        :columns="columns"
        :data="renderData"
        :size="size"
        v-model:selected-keys="selectedKeys"
        :row-selection="rowSelection"
      >
        <!--头像-->
        <template #avatar="{ record }">
          <a-avatar>
            <img alt="avatar" :src="record.avatar" />
          </a-avatar>
        </template>
        <template #roles="{ record }">
          <a-tag v-for="role in record.roles" color="orange">
            {{ role.name }}
          </a-tag>
        </template>
        <!--状态处理-->
        <template #isEnable="{ record }">
          <span v-if="record.isEnable === 1" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`user.table.isEnable.${record.isEnable}`) }}
        </template>
        <template #actions="{ record }">
          <a-space>
            <a-button type="text" shape="round" @click="handleEdit(record)">
              <template #icon>
                <icon-edit />
              </template>
              {{ $t("button.edit") }}
            </a-button>
            <a-button type="text" shape="round" @click="openGrant(record)">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t("button.grantRole") }}
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
    <!--新增和编辑 抽屉-->
    <a-drawer
      v-model:visible="drawerVisible"
      width="650px"
      :mask-closable="false"
      @ok="handleSubmit"
      @cancel="cancelDrawer"
      :title="isEdit ? $t('button.edit') : $t('button.create')"
    >
      <a-form
        ref="formRef"
        :rules="rules"
        auto-label-width
        :model="formData"
        :style="{ width: '600px' }"
      >
        <a-collapse :default-active-key="['1']" :bordered="false">
          <a-collapse-item :header="$t('user.drawer.form.basicInfo')" key="1">
            <a-form-item
              field="name"
              :label="$t('user.table.name')"
              validate-trigger="blur"
            >
              <a-input
                class="form-input"
                v-model="formData.name"
                :placeholder="$t('user.placeholder.name')"
              />
            </a-form-item>
            <a-form-item
              field="account"
              :label="$t('user.table.account')"
              validate-trigger="blur"
            >
              <a-input
                class="form-input"
                v-model="formData.account"
                :placeholder="$t('user.placeholder.account')"
              />
            </a-form-item>
            <a-form-item
              field="password"
              v-show="!isEdit"
              :label="$t('user.table.password')"
              validate-trigger="blur"
            >
              <a-input-password
                class="form-input"
                v-model="formData.password"
                :placeholder="$t('user.placeholder.password')"
              />
            </a-form-item>
            <a-form-item
              field="password2"
              v-show="!isEdit"
              :label="$t('user.table.confirmPassword')"
              validate-trigger="blur"
            >
              <a-input-password
                class="form-input"
                v-model="formData.password2"
                :placeholder="$t('user.placeholder.confirmPassword')"
              />
            </a-form-item>
            <a-form-item
              field="phone"
              :label="$t('user.table.phone')"
              validate-trigger="blur"
            >
              <a-input
                class="form-input"
                v-model="formData.phone"
                :placeholder="$t('user.placeholder.phone')"
              />
            </a-form-item>
            <a-form-item field="email" :label="$t('user.table.email')">
              <a-input
                class="form-input"
                v-model="formData.email"
                :placeholder="$t('user.placeholder.email')"
              />
            </a-form-item>
            <a-form-item
              field="isEnable"
              :label="$t('user.table.isEnable')"
              validate-trigger="blur"
            >
              <a-radio-group v-model="formData.isEnable">
                <a-radio :value="1">{{ $t("user.table.isEnable.1") }}</a-radio>
                <a-radio :value="0">{{ $t("user.table.isEnable.0") }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-collapse-item>
          <a-collapse-item :header="$t('user.drawer.form.roleInfo')" key="2">
            <a-form-item>
              <a-select multiple>
                <a-option>1</a-option>
                <a-option>1</a-option>
              </a-select>
            </a-form-item>
          </a-collapse-item>
        </a-collapse>
      </a-form>
    </a-drawer>
    <!--授权modal-->
    <a-modal
      :title="$t('user.drawer.grantRole')"
      :mask-closable="false"
      v-model:visible="modalVisible"
      @ok="handleGrantSubmit"
      @cancel="cancelModal"
      width="auto"
    >
      <a-tree
        :checkable="true"
        v-model:checked-keys="selectedRole"
        :data="roleData as TreeNodeData[]"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/breadcrumb/index.vue";
import { computed, reactive, ref } from "vue";
import {
  Message,
  type TableColumnData,
  type TableRowSelection,
  type TreeNodeData,
} from "@arco-design/web-vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading.ts";
import {
  assignRole,
  deleteUser,
  getUserPage,
  saveUser,
  updateUser,
} from "@/api/user.ts";
import { getRoleList } from "@/api/role.ts";

type SizeProps = "mini" | "small" | "medium" | "large";

const { t } = useI18n();
//loading
const { loading, setLoading } = useLoading(true);
//表格滚动
const scroll = {
  x: 2000,
}
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

// 生成表单数据模型
const generateFormModel = () => {
  return {
    name: "",
    account: "",
    phone: "",
  };
};
// 筛选表单数据模型
const formModel = ref(generateFormModel());

// 表格数据
const renderData = ref([]);

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
    title: t("user.table.name"),
    dataIndex: "name",
    fixed: "left",
    width: 140,
  },
  {
    title: t("user.table.avatar"),
    dataIndex: "avatar",
    slotName: "avatar",
    width: 100,
  },
  {
    title: t("user.table.account"),
    dataIndex: "account",
  },
  {
    title: t("user.table.roles"),
    dataIndex: "roles",
    slotName: "roles",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t("user.table.phone"),
    dataIndex: "phone",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t("user.table.email"),
    dataIndex: "email",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t("user.table.isEnable"),
    dataIndex: "isEnable",
    slotName: "isEnable",
  },
  {
    title: t("common.table.actions"),
    slotName: "actions",
    fixed: "right",
    width: 220,
  },
];

// 分页
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
});

// 新增或者编辑modal

const INITIAL_DATA = {
  id: "",
  name: "",
  password: "",
  password2: "",
  avatar: "",
  account: "",
  phone: "",
  email: "",
  isEnable: 0,
};

const drawerVisible = ref(false);
const isEdit = ref(false);
const formData = ref({ ...INITIAL_DATA });
const formRef = ref();

// 表单校验规则
const rules = {
  name: [{ required: true, message: t("user.placeholder.name") }],
  account: [{ required: true, message: t("user.placeholder.account") }],
  phone: [{ required: true, message: t("user.placeholder.phone") }],
  password: [{ required: true, message: t("user.placeholder.password") }],
  password2: [
    { required: true, message: t("user.placeholder.confirmPassword") },
    {
      validator: (value: any, cb: any) => {
        if (value !== formData.value.password) {
          cb(t("two passwords do not match"));
        } else {
          cb();
        }
      },
    },
  ],
  isEnable: [{ required: true, message: t("user.placeholder.isEnable") }],
};

//授权modal
const userId = ref("");
const modalVisible = ref(false);
const selectedRole = ref<string[]>([]);

type TreeDataType = {
  key: string;
  title: string;
};
const roleData = ref<TreeDataType[]>([]);

//加载角色列表
const loadRoleList = async () => {
  const res = await getRoleList();
  if (res && res.code === 200) {
    const list = res.data;
    list.forEach((item: any) => {
      let key = item.id;
      roleData.value.push({
        key,
        title: item.name,
      });
    });
  }
};

//授权按钮
const openGrant = async (record: any) => {
  userId.value = record.id;
  modalVisible.value = true;
  //获取用户角色
  selectedRole.value = record.roles.map(
    (item: { id: string }) => item.id,
  ) as string[];
  await loadRoleList();
};

//提交授权
const handleGrantSubmit = async () => {
  setLoading(true);
  try {
    const params = {
      userIds: userId.value,
      roleIds: selectedRole.value.join(","),
    };
    const res = await assignRole(params);
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

//关闭授权modal
const cancelModal = () => {
  modalVisible.value = false;
  userId.value = "";
  selectedRole.value = [];
  roleData.value = [];
};

//获取数据
const fetchData = async (
  params = {
    ...pagination,
  },
) => {
  setLoading(true);
  try {
    const { data } = await getUserPage(params);
    pagination.current = data.current;
    pagination.total = data.total;
    renderData.value = data.records;
  } finally {
    setLoading(false);
  }
};
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
    const res = await deleteUser(params);
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

// 分页页码改变
const onPageChange = (current: number) => {
  pagination.current = current;
  fetchData({ ...pagination, ...formModel.value });
};
// pageSize大小改变
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  fetchData({ ...pagination, ...formModel.value });
};

//modal
//新增
const handleCreate = () => {
  isEdit.value = false;
  drawerVisible.value = true;
};
//编辑
const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(formData.value, record);
  drawerVisible.value = true;
};

// 提交drawer表单
const handleSubmit = async () => {
  setLoading(true);
  try {
    // const valid = await formRef.value.validate();
    // if (valid) return;
    if (!isEdit.value) {
      // 新增逻辑
      const res = await saveUser(formData.value);
      if (res.code === 200) {
        Message.success(t("common.success"));
      }
    } else {
      // 编辑逻辑 不传递密码
      const params = {
        id: formData.value.id,
        name: formData.value.name,
        account: formData.value.account,
        phone: formData.value.phone,
        email: formData.value.email,
        isEnable: formData.value.isEnable,
      };
      const res = await updateUser(params);
      if (res.code === 200) {
        Message.success(t("common.success"));
      }
    }
  } finally {
    clearForm();
    await fetchData();
    setLoading(false);
  }
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

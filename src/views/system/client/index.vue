<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <a-card class="general-card" :title="$t('system.client.list')">
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
      <!--表格区域-->
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
        <!--状态处理-->
        <template #status="{ record }">
          <span v-if="record.status === 0" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`client.table.status.${record.status}`) }}
        </template>
        <!--授权标签处理-->
        <template #grantType="{ record }">
          <a-tag v-for="tag in record.grantTypeList" color="green">
            {{ tag }}
          </a-tag>
        </template>
        <template #actions="slot">
          <a-space>
            <a-button
              type="text"
              shape="round"
              @click="handleEdit(slot.record)"
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
    <!--弹窗-->
    <a-modal
      v-model:visible="modalVisible"
      :footer="false"
      width="auto"
      @cancel="cancelModal"
      :title="isEdit ? $t('client.modal.title.edit') : $t('client.modal.title.add')"
    >
      <a-form
        ref="formRef"
        :style="{ width: '1200px' }"
        auto-label-width
        :model="formData"
        :rules="rules"
        @submit="handleSubmit"
        size="large"
      >
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="clientId"
              :label="$t('client.table.clientId')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input v-model="formData.clientId" :placeholder="$t('client.placeholder.clientId')" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="clientKey"
              :label="$t('client.table.clientKey')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input
                v-model="formData.clientKey"
                :placeholder="$t('client.placeholder.clientKey')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="clientSecret"
              :label="$t('client.table.clientSecret')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input
                v-model="formData.clientSecret"
                :placeholder="$t('client.placeholder.clientSecret')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="activeTimeout"
              :label="$t('client.table.activeTimeout')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input-number
                v-model="formData.activeTimeout"
                mode="button"
                :placeholder="$t('client.placeholder.activeTimeout')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="timeout"
              :label="$t('client.table.timeout')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-input-number
                v-model="formData.timeout"
                mode="button"
                :placeholder="$t('client.placeholder.timeout')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="additionalInfo"
              :label="$t('client.table.additionalInfo')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-textarea
                v-model="formData.additionalInfo"
                :placeholder="$t('client.placeholder.additionalInfo')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="deviceType"
              :label="$t('client.table.deviceType')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-select v-model="formData.deviceType" :placeholder="$t('client.placeholder.deviceType')">
                <a-option>pc</a-option>
                <a-option>miniProgram</a-option>
                <a-option>mobile app</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="grantTypeList"
              :label="$t('client.table.grantType')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-select v-model="formData.grantTypeList" multiple :placeholder="$t('client.placeholder.grantType')">
                <a-option>password</a-option>
                <a-option>client-credentials</a-option>
                <a-option>authorization</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="status"
              :label="$t('client.table.status')"
              validate-trigger="blur"
              label-col-flex="80px"
            >
              <a-radio-group v-model="formData.status">
                <a-radio :value="0">{{ $t("common.active") }}</a-radio>
                <a-radio :value="1">{{ $t("common.locked") }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <!--确定和取消按钮，在modal垂直和水平居中 按钮之间有一定间隔-->
        <a-space style="margin-top: 16px; justify-content: center">
          <a-button type="primary" html-type="submit">
            {{ $t("button.confirm") }}
          </a-button>
          <a-button type="primary" status="warning" @click="cancelModal">
            {{ $t("button.cancel") }}
          </a-button>
        </a-space>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/breadcrumb/index.vue";
import {
  Message,
  type TableColumnData,
  type TableRowSelection,
} from "@arco-design/web-vue";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading.ts";
import { getClientPage, saveOrUpdateClient } from "@/api/client.ts";

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

//modal
const INITIAL_DATA = {
  id: "",
  clientId: "",
  clientKey: "",
  clientSecret: "",
  additionalInfo: "",
  grantTypeList: [] as string[],
  activeTimeout: 3600,
  timeout: -1,
  deviceType: "",
  status: 0,
};

//新增
const handleCreate = () => {
  modalVisible.value = true;
  isEdit.value = false;
};
//编辑
const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(formData.value, record);
  modalVisible.value = true;
};
const modalVisible = ref(false);
const isEdit = ref(false);
const formData = ref({ ...INITIAL_DATA });
const formRef = ref();

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
    title: t("client.table.clientId"),
    dataIndex: "clientId",
    fixed: "left",
    width: 120,
  },
  {
    title: t("client.table.clientKey"),
    dataIndex: "clientKey",
    width: 100,
  },
  {
    title: t("client.table.clientSecret"),
    dataIndex: "clientSecret",
    //文本省略
    ellipsis: true,
    //文字提示
    tooltip: true,
  },
  {
    title: t("client.table.deviceType"),
    dataIndex: "deviceType",
  },
  {
    title: t("client.table.grantType"),
    dataIndex: "grantTypeList",
    slotName: "grantType",
    width: 140,
  },
  {
    title: t("client.table.activeTimeout"),
    dataIndex: "activeTimeout",
  },
  {
    title: t("client.table.timeout"),
    dataIndex: "timeout",
  },
  {
    title: t("client.table.additionalInfo"),
    dataIndex: "additionalInfo",
  },
  {
    title: t("client.table.status"),
    dataIndex: "status",
    slotName: "status",
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
// 表格列

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
    const { data } = await getClientPage(params);
    pagination.current = data.current;
    pagination.total = data.total;
    renderData.value = data.records;
  } finally {
    setLoading(false);
  }
};
fetchData();


// 表单校验规则
const rules = {
  clientId: [{ required: true, message: t("client.placeholder.clientId") }],
  clientKey: [{ required: true, message: t("client.placeholder.clientKey") }],
  clientSecret: [{ required: true, message: t("client.placeholder.clientSecret") }],
  deviceType: [{ required: true, message: t("client.placeholder.deviceType") }],
  grantTypeList: [{ required: true, message: t("client.placeholder.grantType") }],
  activeTimeout: [{ required: true, message: t("client.placeholder.activeTimeout") }],
  timeout: [{ required: true, message: t("client.placeholder.timeout") }],
  status: [{ required: true, message: t("client.placeholder.status") }],
};

//新增或者编辑
const handleSubmit = async () => {
  setLoading(true);
  try {
    const valid = await formRef.value.validate();
    if (valid) return;
    const res = await saveOrUpdateClient(formData.value);
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

//刷新
const refresh = () => {
  fetchData({ ...pagination });
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
const cancelModal = () => {
  clearForm();
};

//清空表单数据、关闭弹窗
const clearForm = () => {
  formRef.value.resetFields();
  modalVisible.value = false;
};
</script>

<style scoped lang="less">
@import "@/style/page.less";

.form-input {
  background-color: #ffffff; /* 设置背景颜色为白色 */
}
</style>

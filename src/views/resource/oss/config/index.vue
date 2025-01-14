<template>
<div class="container">
  <Breadcrumb :items="['menu.resource', 'menu.resource.ossConfig']"/>
  <a-card class="general-card" :title="$t('resource.ossConfig.list')">
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
    <a-table
      rowKey="id"
      :loading="loading"
      :scroll="scroll"
      :pagination="false"
      :columns="columns"
      :data="renderData"
      :bordered="false"
      :size="size"
      v-model:selected-keys="selectedKeys"
      :row-selection="rowSelection"
    >
      <template #isHttps="{ record }">
        <span v-if="record.isHttps === '1'" class="circle"></span>
        <span v-else class="circle pass"></span>
        {{ $t(`resource.ossConfig.isHttps.${record.isHttps}`) }}
      </template>
      <template #isEnable="{ record }">
        <span v-if="record.isEnable === 1" class="circle"></span>
        <span v-else class="circle pass"></span>
        {{ $t(`resource.ossConfig.isEnable.${record.isEnable}`) }}
      </template>
      <template #isSystem="{ record }">
        <span v-if="record.isSystem === 1" class="circle"></span>
        <span v-else class="circle pass"></span>
        {{ $t(`resource.ossConfig.isSystem.${record.isSystem}`) }}
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
  </a-card>
  <!--  编辑和添加弹窗-->
  <a-modal
    v-model:visible="modalVisible"
    :title="isEdit ? $t('resource.ossConfig.edit') : $t('resource.ossConfig.add')"
    width="auto"
    @cancel="cancelModal"
    @ok="handleSubmit"
  >
    <a-form
      :style="{ width: '600px' }"
      ref="formRef"
      :rules="rules"
      auto-label-width
      :model="formData"
    >
      <a-form-item
        field="name"
        :label="$t('resource.ossConfig.name')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.name" :placeholder="$t('resource.ossConfig.namePlaceholder')"/>
      </a-form-item>
      <a-form-item
        field="configKey"
        :label="$t('resource.ossConfig.configKey')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.configKey" :placeholder="$t('resource.ossConfig.configKeyPlaceholder')"/>
      </a-form-item>
      <a-form-item
        field="endpoint"
        :label="$t('resource.ossConfig.endpoint')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.endpoint" :placeholder="$t('resource.ossConfig.endpointPlaceholder')"/>
      </a-form-item>
      <a-form-item
        field="domain"
        :label="$t('resource.ossConfig.domain')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.domain" :placeholder="$t('resource.ossConfig.domainPlaceholder')"/>
      </a-form-item>
      <a-form-item
        field="accessKey"
        :label="$t('resource.ossConfig.accessKey')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.accessKey" :placeholder="$t('resource.ossConfig.accessKeyPlaceholder')"/>
      </a-form-item>
      <a-form-item
        field="secretKey"
        :label="$t('resource.ossConfig.secretKey')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.secretKey"/>
      </a-form-item>
      <a-form-item
        field="bucketName"
        :label="$t('resource.ossConfig.bucketName')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.bucketName" :placeholder="$t('resource.ossConfig.bucketNamePlaceholder')"/>
      </a-form-item>
      <a-form-item
        field="prefix"
        :label="$t('resource.ossConfig.prefix')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.prefix" :placeholder="$t('resource.ossConfig.prefixPlaceholder')"/>
      </a-form-item>
      <a-form-item
        field="region"
        :label="$t('resource.ossConfig.region')"
        validate-trigger="blur"
      >
        <a-input v-model="formData.region" :placeholder="$t('resource.ossConfig.regionPlaceholder')"/>
      </a-form-item>
      <a-form-item
        field="isHttps"
        :label="$t('resource.ossConfig.isHttps')"
        validate-trigger="blur"
      >
        <a-radio-group v-model="formData.isHttps">
          <a-radio value="1">{{ $t("common.yes") }}</a-radio>
          <a-radio value="0">{{ $t("common.no") }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        field="accessPolicy"
        :label="$t('resource.ossConfig.accessPolicy')"
        validate-trigger="blur"
      >
        <a-radio-group v-model="formData.accessPolicy">
          <a-radio value="private">{{ $t("resource.ossConfig.accessPolicy.1") }}</a-radio>
          <a-radio value="public">{{ $t("resource.ossConfig.accessPolicy.2") }}</a-radio>
          <a-radio value="custom">{{ $t("resource.ossConfig.accessPolicy.3") }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        field="isEnable"
        :label="$t('resource.ossConfig.isEnable')"
        validate-trigger="blur"
      >
        <a-radio-group v-model="formData.isEnable">
          <a-radio :value=0>{{ $t("resource.ossConfig.isEnable.0") }}</a-radio>
          <a-radio :value=1>{{ $t("resource.ossConfig.isEnable.1") }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</div>
</template>

<script setup lang="ts">
import Breadcrumb from '@/components/breadcrumb/index.vue';
import useLoading from '@/hooks/loading.ts';
import { computed, reactive, ref } from 'vue';
import { Message, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n';
import { ossConfigDelete, ossConfigList, ossConfigSaveOrUpdate } from '@/api/ossConfig.ts'

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

// 表格选择项配置
const rowSelection = reactive<TableRowSelection>({
  type: "checkbox",
  showCheckedAll: true,
  checkStrictly: true,
});
// 表格选中
const selectedKeys = ref([]);

// 表格列
const columns:TableColumnData[] = [
  {
    title: t("resource.ossConfig.configKey"),
    dataIndex: "configKey",
    fixed: "left",
    width: 150,
  },
  {
    title: t("resource.ossConfig.name"),
    dataIndex: "name",
    fixed: "left",
    width: 150,
  },
  {
    title: t("resource.ossConfig.endpoint"),
    dataIndex: "endpoint",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t("resource.ossConfig.domain"),
    dataIndex: "domain",
  },
  {
    title: t("resource.ossConfig.prefix"),
    dataIndex: "prefix",
  },
  {
    title: t("resource.ossConfig.accessKey"),
    dataIndex: "accessKey",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t("resource.ossConfig.secretKey"),
    dataIndex: "secretKey",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t("resource.ossConfig.bucketName"),
    dataIndex: "bucketName",
  },
  {
    title: t("resource.ossConfig.region"),
    dataIndex: "region",
  },
  {
    title: t("resource.ossConfig.isHttps"),
    dataIndex: "isHttps",
    slotName: "isHttps",
  },
  {
    title: t("resource.ossConfig.accessPolicy"),
    dataIndex: "accessPolicy",
  },
  {
    title: t("resource.ossConfig.isEnable"),
    dataIndex: "isEnable",
    slotName: "isEnable",
  },
  {
    title: t("resource.ossConfig.isSystem"),
    dataIndex: "isSystem",
    slotName: "isSystem",
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

// 弹窗
const INITIAL_DATA ={
  id:'',
  name:'',
  configKey:'',
  endpoint:'',
  domain:'',
  prefix:'',
  accessKey:'',
  secretKey:'',
  bucketName:'',
  region:'',
  isHttps:'0',
  accessPolicy:'public',
  isEnable:0,
  isSystem:0,
};
const modalVisible = ref(false);
const isEdit = ref(false);
const formData = ref({ ...INITIAL_DATA });
const formRef = ref();

const rules = {
  name: [{required:true,message:t("resource.ossConfig.namePlaceholder")}],
  configKey: [{ required: true, message: t("resource.ossConfig.configKeyPlaceholder") }],
  endpoint: [{ required: true, message: t("resource.ossConfig.endpointPlaceholder") }],
  accessKey: [{ required: true, message: t("resource.ossConfig.accessKeyPlaceholder") }],
  secretKey: [{ required: true, message: t("resource.ossConfig.secretKeyPlaceholder") }],
  bucketName: [{ required: true, message: t("resource.ossConfig.bucketNamePlaceholder") }]
};

//表格数据获取
const fetchData = async() =>{
  setLoading(true);
  try {
    const res = await ossConfigList();
    if (res.code === 200) {
      renderData.value = res.data;
    }else {
      Message.error(res.msg);
    }
  }finally {
    setLoading(false);
  }
};
fetchData();

// 表格数据刷新
const refresh = () => {
  fetchData();
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
    const res = await ossConfigDelete(params);
    if (res.code === 200) {
      Message.success(t("common.delete.success"));
    }else {
      Message.error(t("common.fail"));
    }
  }finally {
    await fetchData();
    setLoading(false);
  }
};

//新建
const handleCreate = () => {
  isEdit.value = true;
  modalVisible.value = true;
};

//编辑
const handleEdit = (record: any) => {
  isEdit.value = false;
  formData.value = { ...record };
  modalVisible.value = true;
};

//表单提交
const handleSubmit = async () => {
  setLoading(true);
  const valid = await formRef.value.validate();
  if (valid) return;
  try {
    const res = await ossConfigSaveOrUpdate(formData.value);
    if (res.code === 200) {
      Message.success(t("common.success"));
    } else {
      Message.error(t("common.fail"));
    }
  }finally {
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
@import '@/style/page.less';
</style>
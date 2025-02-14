<template>
<div class="container">
  <Breadcrumb :items="['menu.resource', 'menu.resource.oss']" />
  <a-card class="general-card" :title="$t('resource.oss.list')">
    <!--筛选条件-->
    <a-row>
      <a-col :flex="1">
        <a-form
          :model="filterModel"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item field="service" :label="$t('resource.oss.filter.service')">
                <a-input
                  v-model="filterModel.service"
                  :placeholder=" $t('resource.oss.filter.service.placeholder')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="fileName"
                :label="$t('resource.oss.filter.fileName')"
              >
                <a-input
                  v-model="filterModel.fileName"
                  :placeholder=" $t('resource.oss.filter.filename.placeholder')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="uploadTime" :label="$t('resource.oss.uploadTime')">
                <a-range-picker show-time v-model="filterModel.uploadTime" />
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
      row-key="id"
      :loading="loading"
      :pagination="false"
      :columns="columns"
      :data="renderData"
      :size="size"
      v-model:selected-keys="selectedKeys"
      :row-selection="rowSelection"
    >
<!--      图片预览-->
      <template #url="{ record }">
        <a-image  width="50" :src="record.url" />
      </template>
<!--      <template #uploadTime="{ record }">-->
<!--        {{ record.uploadTime | dateFormat("YYYY-MM-DD") }}-->
<!--      </template>-->
      <template #actions="{ record }">
        <a-space>
          <a-button type="text" shape="round" @click="handleDownload(record)">
            <template #icon>
              <icon-download />
            </template>
            {{ $t("button.download") }}
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
</div>
</template>

<script setup lang="ts">

import Breadcrumb from '@/components/breadcrumb/index.vue';
import { Message, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { deleteOss, getOssPage } from '@/api/oss/oss.ts'
import useLoading from '@/hooks/loading.ts';
import axios from 'axios';
import FileSaver from 'file-saver'
import { globalHeaders } from '@/utils/request.ts'

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

// 表格数据
const renderData = ref([]);
//表格列
const columns: TableColumnData[] = [
  {
    title:t('resource.oss.table.service'),
    dataIndex:'service',
  },
  {
    title:t('resource.oss.table.fileName'),
    dataIndex: 'fileName',
    ellipsis: true,
    tooltip: true,
  },
  {
    title:t('resource.oss.table.originalName'),
    dataIndex: 'originalName',
    ellipsis: true,
    tooltip: true,
  },
  {
    title:t('resource.oss.table.suffix'),
    dataIndex: 'suffix',
  },
  {
    title:t('resource.oss.table.url'),
    dataIndex:'url',
    slotName: 'url',
  },
  {
    title:t('resource.oss.table.createTime'),
    dataIndex:'createTime',
  },
  {
    title: t("common.table.actions"),
    slotName: "actions",
    fixed: "right",
    width: 100,
  },
];
// 分页
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
});

// 生成表单数据模型
const generateFilterModel = () => {
  return {
    service: '',
    uploadTime: [],
    startTime:'',
    endTime:'',
    fileName: '',
  }
}

// 筛选表单数据模型
const filterModel = ref(generateFilterModel());

//获取数据
const fetchData = async (
  params = {
    ...pagination,
  }
) => {
  setLoading(true);
  try {
   const { data } =  await getOssPage(params);
    pagination.current = data.current;
    pagination.total = data.total;
    renderData.value = data.records;
  }finally {
    setLoading(false);
  }
}
fetchData();

//搜索
const search = () =>{
  //处理时间
  if (filterModel.value.uploadTime && filterModel.value.uploadTime.length > 0) {
    filterModel.value.startTime = filterModel.value.uploadTime[0];
    filterModel.value.endTime = filterModel.value.uploadTime[1];
  }
  fetchData({...pagination, ...filterModel.value});
}

//刷新
const refresh = () => {
  fetchData({...pagination, ...filterModel.value});
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
    const res = await deleteOss(params);
    if (res.code === 200) {
      Message.success(t("common.success"));
    } else {
      Message.error(t("common.fail"));
    }
  }finally {
    await fetchData()
    setLoading(false);
  }
};

//下载
const handleDownload = async (record: any) => {
  const id = record.id;
  const url = '/api/resource/oss/download?id=' + id;
  const res = await axios({
    method: 'get',
    url: url,
    responseType: 'blob', // 重要
    headers: globalHeaders()
  });
  const blob = new Blob([res.data], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, decodeURIComponent(res.headers['download-filename'] as string));
};


// 分页页码改变
const onPageChange = (current: number) => {
  pagination.current = current;
  fetchData({ ...pagination, ...filterModel.value });
};
// pageSize大小改变
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  fetchData({ ...pagination, ...filterModel.value });
};

</script>



<style scoped lang="less">
@import "@/style/page.less";
</style>
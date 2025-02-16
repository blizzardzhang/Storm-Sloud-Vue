<template>
  <a-upload
    draggable
    multiple
    :action="uploadFileUrl"
    :headers="uploadHeaders"
    list-type="picture"
    @progress="handleProgress"
    @success="handleSuccess"
    @error="handleFail"
  >
  </a-upload>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { globalHeaders } from '@/utils/request.ts'
import { Message } from '@arco-design/web-vue'

const emits = defineEmits(['uploadSuccess']);

const uploadFileUrl = ref('/api/resource/oss/upload'); // 上传文件服务器地址
const uploadHeaders = ref(globalHeaders())

// 处理编辑器图片上传进度回调函数
const handleProgress = (event: any) => {
  console.log('上传进度:', event.percent);
}

// 处理编辑器图片上传成功回调函数
const handleSuccess = (res: any) => {
  if (res.response.code === 200) {
    emits('uploadSuccess', res.response.data);
  }
}
// 处理编辑器图片上传失败回调函数
const handleFail = (err: any) => {
  Message.error('上传失败' + err.message);
}



</script>



<style scoped lang="less">

</style>
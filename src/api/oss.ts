import { request } from '@/utils/request.ts'

export function getOssPage(params: any): Promise<any> {
  return request({
    url: '/resource/oss/page',
    method: 'post',
    data: params,
  })
}

//删除
export function deleteOss(params: any): Promise<any> {
  return request({
    url: '/resource/oss/delete',
    method: 'get',
    params: params,
  })
}

//下载
export function downloadOss(params:any): Promise<any> {
  return request({
    url: '/resource/oss/download',
    method: 'get',
    responseType: 'blob',
    params: params,
  })
}





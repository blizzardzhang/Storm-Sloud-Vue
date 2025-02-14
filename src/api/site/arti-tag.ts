//分页
import { request } from '@/utils/request.ts'

export function getArtiTagPage(params: any): Promise<any> {
  return request({
    url: '/site/arti-tag/page',
    method: 'post',
    data: params,
  })
}

//删除
export function deleteArtiTag(params: any): Promise<any> {
  return request({
    url: '/site/arti-tag/delete',
    method: 'get',
    params: params,
  })
}

//新增或者编辑
export function saveOrUpdateArtiTag(params: any): Promise<any> {
  return request({
    url: '/site/arti-tag/saveOrUpdate',
    method: 'post',
    data: params,
  })
}
//分页
import { request } from '@/utils/request.ts'

export function getClientPage(params: any): Promise<any> {
  return request({
    url: '/system/client/page',
    method: 'post',
    data: params,
  })
}

//新增或修改
export function saveOrUpdateClient(params: any): Promise<any> {
  return request({
    url: '/system/client/saveOrUpdate',
    method: 'post',
    data: params,
  })
}

//删除
export function deleteClient(params: any) : Promise<any> {
  return request({
    url: '/system/client/delete',
    method: 'get',
    params: params,
  })
}

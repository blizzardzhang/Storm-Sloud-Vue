//列表
import { request } from '@/utils/request.ts'

export function ossConfigList(): Promise<any> {
  return request({
    url: '/resource/ossConfig/list',
    method: 'get'
  })
}
//删除
export function ossConfigDelete(param:any): Promise<any> {
  return request({
    url: '/resource/ossConfig/delete',
    method: 'get',
    params: param
  })
}
//新增或修改
export function ossConfigSaveOrUpdate(data: any): Promise<any> {
  return request({
    url: '/resource/ossConfig/saveOrUpdate',
    method: 'post',
    data
  })
}

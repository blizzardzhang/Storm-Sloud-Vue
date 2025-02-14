import { request } from '@/utils/request.ts'

//给角色授权
export function grantRole(param:any):Promise<any> {
  return request({
    url: '/system/role/grant',
    method: 'post',
    data: param,
  })
}
//分页
export function getRolePage(params:any):Promise<any> {
  return request({
    url: '/system/role/page',
    method: 'post',
    data: params,
  })
}
//列表
export function getRoleList():Promise<any> {
  return request({
    url: '/system/role/list',
    method: 'get',
  })
}

//删除
export function deleteRole(param:any):Promise<any> {
  return request({
    url: '/system/role/delete',
    method: 'get',
    params: param,
  })
}

//新增或修改
export function saveOrUpdateRole(param:any):Promise<any> {
  return request({
    url: '/system/role/saveOrUpdate',
    method: 'post',
    data: param,
  })
}

//获取角色详情
export function getRoleDetail(param:any):Promise<any> {
  return request({
    url: '/system/role/detail',
    method: 'get',
    params: param,
  })
}

import { request } from "@/utils/request.ts";

export interface LoginData {
  clientId: string;
  grantType: string;
  account: string;
  password: string;
}
export interface PageParams {
  current?: number;
  pageSize?: number;
}
// 登录接口
export function login(data: any): Promise<any> {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data
  });
}
// 登出
export function logout() : Promise<any>{
  return request({
    url: '/auth/logout',
    method: 'get'
  });
}

//给用户分配角色
export function assignRole(param : any):Promise<any> {
  return request({
    url: '/system/user/allocateRole',
    method: 'post',
    data: param
  });
}

// 获取用户信息
export function getUserInfo(): Promise<any> {
  return request({
    url: '/system/user/info',
    method: 'get',
  });
}

//获取用户菜单
export function getMenuList(params:{category:number}):Promise<any> {
  return request({
    url: '/system/menu/routes',
    method: 'get',
    params: params
  });
}

//用户分页
export function getUserPage(params:any):Promise<any> {
  return request({
    url: '/system/user/page',
    method: 'post',
    data: params
  });
}

//新增
export function saveUser(param : any):Promise<any> {
  return request({
    url: '/system/user/save',
    method: 'post',
    data: param
  });
}

//更新
export function updateUser(param : any):Promise<any> {
  return request({
    url: '/system/user/update',
    method: 'post',
    data: param
  });
}

//删除
export function deleteUser(param : any):Promise<any> {
  return request({
    url: '/system/user/delete',
    method: 'get',
    params: param
  });
}

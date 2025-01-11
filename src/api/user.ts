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

// 获取用户信息
export function getUserInfo(): Promise<any> {
  return request({
    url: '/user/user/info',
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
    url: '/user/user/page',
    method: 'post',
    data: params
  });
}

//新增
export function saveUser(param : any):Promise<any> {
  return request({
    url: '/user/user/save',
    method: 'post',
    data: param
  });
}

//更新
export function updateUser(param : any):Promise<any> {
  return request({
    url: '/user/user/update',
    method: 'post',
    data: param
  });
}

//删除
export function deleteUser(param : any):Promise<any> {
  return request({
    url: '/user/user/delete',
    method: 'get',
    params: param
  });
}

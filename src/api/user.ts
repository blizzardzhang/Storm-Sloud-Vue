import { request } from "@/utils/request.ts";

export interface LoginData {
  clientId: string;
  grantType: string;
  account: string;
  password: string;
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

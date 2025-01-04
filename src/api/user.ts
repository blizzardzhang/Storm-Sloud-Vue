import { request } from "@/utils/request.ts";

export interface LoginData {
  account: string;
  password: string;
}

// 登录接口
export function login(data: LoginData) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data
  });
}
// 登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'get'
  });
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/system/user/info',
    method: 'get',
  });
}

//获取用户菜单
export function getMenuList(category: number) {
  return request({
    url: '/system/menu/routes',
    method: 'get',
    params: category
  });
}

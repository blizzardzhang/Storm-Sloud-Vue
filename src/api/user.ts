import { request } from "@/utils/request.ts";

export interface LoginData {
  account: string;
  password: string;
}

// 登录接口
export function login(data: LoginData) {
  return request({
    url: "/auth/login",
    method: "post",
    data: data
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

import { request } from "@/utils/request.ts";

/**
 * 获取菜单树
 *
 * @returns 返回的Promise对象，解析结果为任意类型
 */
export function menuTree(param: any): Promise<any> {
  return request({
    url: "/system/menu/tree",
    method: "post",
    data: param,
  });
}

/**
 * 树选择器
 */
export function menuTreeSelect(): Promise<any> {
  return request({
    url: "/system/menu/treeSelect",
    method: "get",
  });
}
//新增或修改
export function saveOrUpdateMenu(param: any): Promise<any> {
  return request({
    url: "/system/menu/saveOrUpdate",
    method: "post",
    data: param,
  });
}


/**
 * 删除菜单
 * @param param
 */
export function deleteMenu(param: any): Promise<any> {
  return request({
    url: "/system/menu/delete",
    method: "get",
    params: param,
  });
}

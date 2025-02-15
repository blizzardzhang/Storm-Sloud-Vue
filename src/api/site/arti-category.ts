//分页
import { request } from '@/utils/request.ts'


export function getArtiCategoryPage(params: any): Promise<any> {
  return request({
    url: '/site/arti-category/page',
    method: 'post',
    data: params,
  })
}

//所有分类列表
export function getArtiCategoryList(params: any): Promise<any> {
  return request({
    url: '/site/arti-category/list',
    method: 'get',
    params: params,
  })
}

//删除
export function deleteArtiCategory(params: any): Promise<any> {
  return request({
    url: '/site/arti-category/delete',
    method: 'get',
    params: params,
  })
}

//新增或者编辑
export function saveOrUpdateArtiCategory(params: any): Promise<any> {
  return request({
    url: '/site/arti-category/saveOrUpdate',
    method: 'post',
    data: params,
  })
}
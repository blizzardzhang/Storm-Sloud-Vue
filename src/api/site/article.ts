//分页
import { request } from '@/utils/request.ts'

export function getArticlePage(params: any): Promise<any> {
  return request({
    url: '/site/article/page',
    method: 'post',
    data: params,
  })
}

//新增或者编辑
export function saveOrUpdateArticle(params: any): Promise<any> {
  return request({
    url: '/site/article/saveOrUpdate',
    method: 'post',
    data: params,
  })
}


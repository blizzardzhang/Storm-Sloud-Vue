//分页
import { request } from '@/utils/request.ts'

export function getArticlePage(params: any): Promise<any> {
  return request({
    url: '/site/article/page',
    method: 'post',
    data: params,
  })
}


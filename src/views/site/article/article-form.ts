export interface BaseInfoModel{
  type: string;
  title: string;
  description: string;
  author: string;
  categoryId: string;
  coverImg: string;
  tags: string;
  tagListStr: string[];
  publishTime: string;
  location?: string;
}

export interface ContentModel{
  content: string;
}


export interface Category {
  id: number;
  name: string;
  type: number; // 0: 全部, 1: 技术文章, 2: 生活小记
}
export interface Tags {
  id: number;
  name: string;
  type: number; // 0: 全部, 1: 技术文章, 2: 生活小记
}

export interface Article {
  id: number;
  type: number; // 0: 技术文章, 1: 生活小记
  artiStatus: number; //  0:待审核 1:审核通过发布 2:未通过审核
  title: string;
  author: string;
  description: string;
  content: string;
  categoryId: string;
  categoryName: string;
  coverImg: string;
  coverImgUrl: string;
  tags: string;
  tagList: string[];
  publishTime: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  stars: number;
  location?: string;
}

export type ArticleModel = BaseInfoModel & ContentModel;

//基本分页
export interface Pagination{
  current: number;
  pageSize: number;
  total?: number;
}


//菜单数据
export interface SysMenu{
  id: string;
  parentId: string;
  category: number;
  name: string;
  title: string;
  code?: string;
  locale?: string;
  activeMenu?: boolean;
  permission?: string;
  redirect?: string;
  noAffix?: boolean;
  ignoreCache?: boolean;
  component?: string;
  icon?: string;
  path: string;
  sort: number;
  children?: SysMenu[];
}




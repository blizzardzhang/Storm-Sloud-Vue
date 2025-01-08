import axios from 'axios';
import { Message } from '@arco-design/web-vue';
import { clearToken, getToken } from '@/utils/auth.ts'
import router from '@/router';

export const request = axios.create({
  timeout: 30000,
  baseURL: import.meta.env.VITE_BASE_URL_PREFIX,
});


// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里做一些请求前的配置，比如设置token等
    const token = getToken();
    if (token){
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.clientId = import.meta.env.VITE_CLIENT_ID;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 200) {
      return res;
    }else if (res.code === 401){
      clearToken();
      Message.error('登录过期，请重新登录')
      router.push('/login')
    }else if (res.code === 403){
      Message.error('权限不足')
    }else{
      Message.error(res.msg);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
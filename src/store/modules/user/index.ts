import { defineStore } from 'pinia';
import type { UserState, UserStoreState } from '@/store/modules/user/types.ts';
import { login as userLogin, type LoginData } from "@/api/user";
import { clearToken, setToken } from "@/utils/auth.ts";

const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    userInfo: {} as UserState,
    accessToken: '',
  }),
  getters: {
    getUserInfo(state: UserStoreState): UserState {
      return { ...state.userInfo };
    },
    getAccessToken(state: UserStoreState): string {
      return state.accessToken;
    }
  },
  actions: {
    // 设置用户
    setUserInfo(userInfo: UserState) {
      this.userInfo = userInfo;
    },
    // 设置token
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    // 重置用户
    resetUserInfo() {
      this.userInfo = {};
    },


    //login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.access_token);
      }catch (error) {
        clearToken()
        throw error;
      }
    }

  }
});

export default useUserStore;
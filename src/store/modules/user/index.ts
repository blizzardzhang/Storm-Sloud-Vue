import { defineStore } from 'pinia';
import type { UserState, UserStoreState } from '@/store/modules/user/types.ts';
import { getUserInfo, login as userLogin, type LoginData, logout as userLogout} from '@/api/user'
import { clearToken, setToken } from "@/utils/auth.ts";
import { useAppStore } from '@/store'

const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    userInfo: {} as UserState,
    accessToken: '',
    permissions: [] as string[]
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
    // 重置
    resetInfo() {
      this.$reset();
    },

    //info
    async info() {
      const res = await getUserInfo();
      this.setUserInfo(res.data);
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
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      appStore.clearServerMenu();
    },

    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },

  }
});

export default useUserStore;
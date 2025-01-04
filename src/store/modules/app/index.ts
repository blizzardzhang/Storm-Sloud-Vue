import { defineStore } from 'pinia';
import type { AppState } from '@/store/modules/app/types.ts';
import defaultSettings from '@/config/settings.json';
import type { RouteRecordNormalized } from "vue-router";
import { getMenuList } from '@/api/user.ts';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';

const useAppState = defineStore("appState", {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    // 当前配置信息
    appCurrentSettings: (state: AppState) => {
      return { ...state };
    },
    // 当前设备
    appDevice: (state: AppState) => {
      return state.device;
    },
    // 异步菜单列表
    appAsyncMenus: (state: AppState) => {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    }
  },

  actions: {
    // 更新配置信息
    updateSettings(partial: Partial<AppState>) {
      // @ts-expect-error-next-line
      this.$patch(partial);
    },
    // 改变主题颜色
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = "dark";
        document.body.setAttribute("arco-theme", "dark");
      } else {
        this.theme = "light";
        document.body.removeAttribute("arco-theme");
      }
    },
    //toggleDevice
    toggleDevice(device: string) {
      this.device = device;
    },
    // 切换菜单显示隐藏状态
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },

    async fetchServerMenu() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: "menuNotice", // Keep the instance id the same
          content: "loading",
          closable: true
        });
        const { data } = await getMenuList(1);
        this.serverMenu = data;
        if (notifyInstance) {
          notifyInstance.close();
        }
        notifyInstance = Notification.success({
          id: "menuNotice",
          content: "success",
          closable: true
        });
      } catch (error) {
        if (notifyInstance) {
          notifyInstance.close();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: "menuNotice",
          content: "error",
          closable: true
        });
      }
    }
  }

});

export default useAppState;
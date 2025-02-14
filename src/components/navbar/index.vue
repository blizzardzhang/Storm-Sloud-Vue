<template>
  <div class="navbar">
    <!--左侧-->
    <div class="left-side">
      <a-space>
        <img
          alt="logo"
          src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
        />
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          Storm Cloud
        </a-typography-title>
        <icon-menu-fold
          v-if="!topMenu && appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" />
    </div>
    <ul class="right-side">
      <!--搜索框-->
<!--      <li>-->
<!--        <a-tooltip :content="$t('settings.search')">-->
<!--          <a-button class="nav-btn" type="outline" :shape="'circle'">-->
<!--            <template #icon>-->
<!--              <icon-search />-->
<!--            </template>-->
<!--          </a-button>-->
<!--        </a-tooltip>-->
<!--      </li>-->
      <!--GitHub-->

      <li>
        <a-tooltip :content="$t('navbar.github')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="navToGitHub">
            <template #icon>
              <icon-github/>
            </template>
          </a-button>
        </a-tooltip>
      </li>

      <!--语言-->
      <li>
        <a-tooltip :content="$t('navbar.language')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              <template #icon>
                <icon-check v-show="item.value === currentLocale" />
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <!--主题-->
      <li>
        <a-tooltip :content="theme === 'light'? $t('navbar.theme.toDark') : $t('navbar.theme.toLight')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="handleToggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--通知-->
      <li>
        <a-tooltip :content="$t('navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button
                class="nav-btn"
                type="outline"
                :shape="'circle'"
                @click="setPopoverVisible"
              >
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          trigger="click"
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: '0', minWidth: '400px' }"
          content-class="message-popover"
          >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <message-box/>
          </template>
        </a-popover>
      </li>
      <!--全屏-->
      <li>
        <a-tooltip
          :content="
          isFullscreen ? $t('navbar.screen.toExi') : $t('navbar.screen.toFull')"
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--设置-->
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setVisible"
          >
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--用户-->
      <li>
        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{ marginRight: '8px', cursor: 'pointer' }"
          >
            <img alt="avatar" :src="avatar">
          </a-avatar>
          <template #content>
            <a-doption>
              <!--用户信息-->
              <a-space @click="$router.push({ name: 'Info' })">
                <icon-user />
                <span>
                  {{ userName }}
                </span>
              </a-space>
            </a-doption>
            <!--用户设置-->
            <a-doption>
              <a-space @click="$router.push({ name: 'Setting' })">
                <icon-settings />
                <span>
                  {{ $t('navbar.user.settings') }}
                </span>
              </a-space>
            </a-doption>
            <!--登出-->
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  {{ $t('navbar.user.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { useAppStore, useUserStore } from '@/store'
import { computed, inject, ref } from "vue";
import Menu from "@/components/menu/index.vue";
import MessageBox from "@/components/message-box/index.vue";
import useLocale from "@/hooks/locale";
import { LOCALE_OPTIONS } from "@/locale";
import { useDark, useFullscreen, useToggle } from '@vueuse/core'
import useUser from '@/hooks/user.ts'

const appStore = useAppStore();
const usrStore = useUserStore();
const { logout } = useUser();
const { changeLocale, currentLocale } = useLocale();
const locales = [...LOCALE_OPTIONS];
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();


// 是否是顶部菜单
const topMenu = computed(() => appStore.topMenu && appStore.menu);
// 主题
const theme = computed(() => {
  return appStore.theme;
});
//账号
const userName = computed(() => {
  return usrStore.userInfo.name;
});
// 头像
const avatar = computed(() => {
  return usrStore.userInfo.avatar;
});
// 下拉按钮触发器
const triggerBtn = ref();
// 弹出框触发器
const refBtn = ref();
// 切换菜单抽屉状态 搭配default-layout父组件中的抽屉菜单联动
const toggleDrawerMenu = inject("toggleDrawerMenu") as () => void;

//代码仓
const navToGitHub = () => {
  window.open('https://github.com/blizzardzhang');
};
// 设置下拉按钮可见性
const setDropDownVisible = () => {
  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  triggerBtn.value.dispatchEvent(event);
};

// 设置弹出框可见性
const setPopoverVisible = () => {
  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  refBtn.value.dispatchEvent(event);
};

// 切换主题
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => {
  toggleTheme();
};

//设置
const setVisible = () => {
  appStore.updateSettings({globalSettings: true});
};

// 登出
const handleLogout = () => {
  logout()
};
</script>

<style scoped lang="less">
.navbar{
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.center-side {
  flex: 1;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;
  :deep(.locale-select) {
    border-radius: 20px;
  }
  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }
  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }
  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }
  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>

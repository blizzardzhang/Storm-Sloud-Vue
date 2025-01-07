import { useAppStore } from '@/store'
import { useDebounceFn } from '@vueuse/core'
import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { addEventListen, removeEventListen } from '@/utils/event.ts'

const WIDTH = 992; // https://arco.design/vue/component/grid#responsivevalue

/**
 * 查询设备屏幕宽度是否小于某个特定值
 * @returns 如果屏幕宽度小于 WIDTH，则返回 true，否则返回 false
 */
function queryDevice(){
  const rect = document.body.getBoundingClientRect();
  return rect.width - 1 < WIDTH;
}

export default function useResponsive(immediate?: boolean) {
  const appStore = useAppStore();
  /**
   * 窗口大小调整处理函数
   * 当窗口大小发生变化时，此函数会被调用。
   * 如果document未被隐藏，则检查当前设备是否为移动设备，
   * 并根据设备类型切换应用布局和菜单显示状态。
   */
  function resizeHandler() {
    if (!document.hidden) {
      const isMobile = queryDevice();
      appStore.toggleDevice(isMobile ? 'mobile' : 'desktop');
      appStore.toggleMenu(isMobile)
    }
  }
  const debounceFn = useDebounceFn(resizeHandler, 100);
  onMounted(() => {
    if (immediate) {
      debounceFn();
    }
  });
  onBeforeMount(() => {
    addEventListen(window,'resize', debounceFn);
  });
  onBeforeUnmount(() => {
    removeEventListen(window,'resize', debounceFn);
  });
}
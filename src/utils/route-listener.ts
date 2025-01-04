import mitt from 'mitt';
import type { Handler } from 'mitt';
import type { RouteLocationNormalized } from 'vue-router';

const emitter = mitt();
const key = Symbol('ROUTER_CHANGE');
let latestRoute: RouteLocationNormalized;

/**
 * 设置路由发射器
 * @param to 路由目标位置信息
 */
export function setRouteEmitter(to: RouteLocationNormalized) {
  emitter.emit(key, to);
  latestRoute = to;
}

/**
 * 监听路由变化
 *
 * @param handler 路由变化时的回调函数，参数为路由位置信息
 * @param immediate 是否立即执行一次回调函数，默认值为 true
 */
export function listenerRouteChange(
  handler: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(key, handler as Handler);
  if (immediate && latestRoute) {
    handler(latestRoute);
  }
}

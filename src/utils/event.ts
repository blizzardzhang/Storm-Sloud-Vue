/**
 * 给指定的目标元素添加事件监听器
 *
 * @param target 目标元素，可以是 Window 对象或 HTMLElement 对象
 * @param event 要监听的事件类型
 * @param handler 事件触发时调用的回调函数或事件监听器对象
 * @param capture 是否在捕获阶段触发事件监听器，默认为 false
 */
export function addEventListen(
  target: Window | HTMLElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  capture =  false,
){
  if (
    target.addEventListener &&
    typeof target.addEventListener === "function"
  ){
    target.addEventListener(event, handler, capture);
  }
}

/**
 * 从指定的目标元素移除事件监听器
 *
 * @param target 目标元素，可以是 Window 对象或 HTMLElement 对象
 * @param event 要移除的事件类型
 * @param handler 事件触发时调用的回调函数或事件监听器对象
 * @param capture 是否在捕获阶段移除事件监听器，默认为 false
 */
export function removeEventListen(
  target: Window | HTMLElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  capture = false,
){
  if (
    target.removeEventListener &&
    typeof target.removeEventListener === "function"
  ){
    target.removeEventListener(event, handler, capture);
  }
}
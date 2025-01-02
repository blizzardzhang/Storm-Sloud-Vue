const modules = import.meta.glob("./modules/*.ts", {
  eager: true
});

/**
 * 将模块对象转换为路由记录数组。
 * @param modules 包含模块的对象，每个模块应包含名为 `default` 的属性，该属性可以是一个路由记录对象或路由记录对象数组。
 * @param result 用于存储转换后的路由记录数组的容器。
 * @returns 返回填充了转换后路由记录的数组。
 */
function formatModules(modules: any, result: RouteRecordNormalized[]) {
  Object.keys(modules).forEach((key) => {
    const defaultModule = modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule]  : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);
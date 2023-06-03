import { router, addRoutes } from "~/router";
import { getToken } from "~/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "~/composables/util";
import store from "./store";
// 全局前置守卫
let hasGetInfo = false
router.beforeEach(async (to, from, next) => {
  // 显示loading
  showFullLoading();
  const token = getToken();
  // 判断是否有token以及当前是否在login登录页面
  if (!token && to.path != "/login") {
    toast("请先登录", "error");
    return next({
      path: "/login",
    });
  }
  // 防止重复登录
  if (token && to.path == "/login") {
    toast("请勿重复登录", "error");
    return next({
      path: from.path ? from.path : "/",
    });
  }
  let hasNewRoutes = false;
  // 如果用户登录了，自动获取用户信息, 并存储在vuex当中
  // hasGetInfo为false时才去添加路由，防止重复请求
  if (token && !hasGetInfo) {
    let { menus } = await store.dispatch("getinfo");
    hasGetInfo = true
    // 动态添加路由
    hasNewRoutes = addRoutes(menus);
  }
  // 设置页面标题
  let title = (to.meta.title ? to.meta.title : "") + "-亭林商城后台";
  document.title = title;
  hasNewRoutes ? next(to.fullPath) : next();
});
// 全局后置守卫
router.afterEach((to, from) => hideFullLoading());

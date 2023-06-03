import { createRouter, createWebHashHistory } from "vue-router";
import Index from "~/pages/index.vue";
import Login from "~/pages/Login.vue";
import NotFound from "~/pages/404.vue";
import Admin from "~/layouts/admin.vue";
import GoodList from "~/pages/goods/list.vue";
import CategoryList from "~/pages/category/list.vue";
import UserList from "~/pages/user/list.vue";
import ImageList from "~/pages/image/list.vue";
import NoticeList from "~/pages/notice/list.vue";
import CouponList from "~/pages/coupon/list.vue";
import SettingBase from "~/pages/setting/base.vue";
import CommentList from "~/pages/comment/list.vue";
import OrderList from "~/pages/order/list.vue";
import ManagerList from "~/pages/manager/list.vue";
import AccessList from "~/pages/access/list.vue";
import RoleList from "~/pages/role/list.vue";
import SkusList from "~/pages/skus/list.vue";
import LevelList from "~/pages/level/list.vue";
import SettingBuy from "~/pages/setting/buy.vue";
import SettingShip from "~/pages/setting/ship.vue";
import DistributionIndex from "~/pages/distribution/index.vue";
import DistributionSetting from "~/pages/distribution/setting.vue";

// 默认路由，所有用户共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "登录页",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];
//动态路由，用来匹配菜单动态添加路由
const asyncRouters = [
  {
    path: "/",
    name: "/",
    component: Index,
    meta: {
      title: "后台首页",
    },
  },
  {
    name: "/goods/list",
    path: "/goods/list",
    component: GoodList,
    meta: {
      title: "商品管理",
    },
  },
  {
    name: "/category/list",
    path: "/category/list",
    component: CategoryList,
    meta: {
      title: "分类列表",
    },
  },
  {
    name: "/user/list",
    path: "/user/list",
    component: UserList,
    meta: {
      title: "用户列表",
    },
  },
  {
    name: "/order/list",
    path: "/order/list",
    component: OrderList,
    meta: {
      title: "订单列表",
    },
  },
  {
    name: "/comment/list",
    path: "/comment/list",
    component: CommentList,
    meta: {
      title: "评价列表",
    },
  },
  {
    name: "/image/list",
    path: "/image/list",
    component: ImageList,
    meta: {
      title: "图库列表",
    },
  },
  {
    name: "/notice/list",
    path: "/notice/list",
    component: NoticeList,
    meta: {
      title: "公告列表",
    },
  },
  {
    name: "/setting/base",
    path: "/setting/base",
    component: SettingBase,
    meta: {
      title: "配置",
    },
  },
  {
    name: "/coupon/list",
    path: "/coupon/list",
    component: CouponList,
    meta: {
      title: "优惠券列表",
    },
  },
  {
    name: "/manager/list",
    path: "/manager/list",
    component: ManagerList,
    meta: {
      title: "管理员管理列表",
    },
  },
  {
    name: "/access/list",
    path: "/access/list",
    component: AccessList,
    meta: {
      title: "菜单权限管理",
    },
  },
  {
    name: "/role/list",
    path: "/role/list",
    component: RoleList,
    meta: {
      title: "角色管理",
    },
  },
  {
    name: "/skus/list",
    path: "/skus/list",
    component: SkusList,
    meta: {
      title: "规格管理",
    },
  },
  {
    name: "/level/list",
    path: "/level/list",
    component: LevelList,
    meta: {
      title: "会员等级",
    },
  },
  {
    name: "/setting/buy",
    path: "/setting/buy",
    component: SettingBuy,
    meta: {
      title: "支付设置",
    },
  },
  {
    name: "/setting/ship",
    path: "/setting/ship",
    component: SettingShip,
    meta: {
      title: "物流设置",
    },
  },
  {
    name: "/distribution/index",
    path: "/distribution/index",
    component: DistributionIndex,
    meta: {
      title: "分销员管理",
    },
  },
  {
    name: "/distribution/setting",
    path: "/distribution/setting",
    component: DistributionSetting,
    meta: {
      title: "分销设置",
    },
  },
];
export const router = createRouter({
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});
// 添加动态路由的方法
export function addRoutes(menus) {
  // 是否有新的路由
  let hasNewRoutes = false;
  const findAddRoutesByMenus = (arr) => {
    arr.forEach((e) => {
      let item = asyncRouters.find((i) => i.path == e.frontpath);
      if (item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item);
        hasNewRoutes = true;
      }
      if (e.child && e.child.length > 0) {
        findAddRoutesByMenus(e.child);
      }
    });
  };
  findAddRoutesByMenus(menus);
  return hasNewRoutes;
}

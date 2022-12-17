import * as VueRouter from "vue-router";

import localCache from "../utils/cache";
import mainStore from "../pinia/mainStore";

const routes = [
  { path: "/", redirect: "/main" },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/register/register.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/login.vue"),
  },
  {
    path: "/main",
    name: "main",
    component: () => import("../views/main/main.vue"),
    children: [],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/not-found/not-found.vue"),
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const main = mainStore();
  let userInfo = main.userInfo;

  if (to.path !== "/login" || to.path !== "/register") {
    if (!userInfo) {
      return "/login";
    }
  }

  // 解决刷新丢失页面问题
  if (from.path === "/" && to.path !== "/main") {
    main.recordURL = to.path;
    return "/main";
  }

  return true;
});

export default router;

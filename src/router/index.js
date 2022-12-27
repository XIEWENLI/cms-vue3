import * as VueRouter from "vue-router";

import localCache from "../utils/cache";
import mainStore from "../pinia/mainStore";
import XWLRequest from "../servise/index";

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
  let userInfo = localCache.getCache("userInfo");
  userInfo = userInfo ? JSON.parse(userInfo) : undefined;

  if (to.path === "/login" || to.path === "/register") {
    return true;
  }

  if (!userInfo) {
    return "/login";
  } else {
    // token验证
    const res = await XWLRequest.get({ url: "/auth/verifyToken" });

    if (!res.data.status) {
      ElMessage.error(res.data.message);
      localCache.deleteCache("userInfo");
      return "/login";
    }
  }

  // 解决刷新丢失页面问题
  if (from.path === "/" && to.path !== "/main") {
    mainStore().recordURL = to.path;
    return "/main";
  }

  return true;
});

export default router;

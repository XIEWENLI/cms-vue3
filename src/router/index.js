import * as VueRouter from "vue-router";

const routes = [
  { path: "/", redirect: "/main" },
  {
    path: "/main",
    component: () => import("../views/main/main.vue"),
    children: [],
  },
  { path: "/login", component: () => import("../views/login/login.vue") },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;

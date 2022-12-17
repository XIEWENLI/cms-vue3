import router from "../router";
import { defineStore } from "pinia";

import localCache from "../utils/cache";
import { mapMenu } from "../utils/mapMenu";

const mainStore = defineStore("main", {
  state: () => {
    return {
      openState: true,
      userInfo: {},
      oneLevelMenu: [],
      actionIndex: "",
      URL: "/main",
      recordURL: "",
    };
  },
  actions: {
    reverseOpenState() {
      this.openState = !this.openState;
    },

    // 动态添加路由函数
    async addMenu() {
      let userInfo = mainStore().userInfo;
      const routes = await mapMenu(userInfo.menu);
      routes.forEach((route) => {
        router.addRoute("main", route);
      });
    },
  },
});

export async function reflectPage() {
  console.log("页面刷新或初次渲染执行~");
  let userInfo = localCache.getCache("userInfo");
  userInfo = userInfo ? JSON.parse(userInfo) : undefined;

  const main = mainStore();
  // localStorage->pinia
  main.userInfo = userInfo;
  // 动态添加路由
  main.addMenu();

  userInfo.menu.forEach((item) => {
    if (item.type === 1) {
      main.oneLevelMenu.push(item);
    }
  });
}

export default mainStore;

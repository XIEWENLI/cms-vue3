import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";

import "./style.css";
import { reflectPage } from "./pinia/mainStore";
import router from "./router/index";
import icon from "./global/icon";

const app = createApp(App);

const store = createPinia();
app.use(store);

// 页面刷新或初次渲染执行
reflectPage();
app.use(icon);
app.use(router);

app.mount("#app");

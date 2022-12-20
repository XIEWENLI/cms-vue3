import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";

import "./style.css";
import router from "./router/index";
import icon from "./global/icon";

const app = createApp(App);

app.use(createPinia());

app.use(icon);
app.use(router);

app.mount("#app");

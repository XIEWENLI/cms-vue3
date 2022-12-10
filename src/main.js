import { createApp } from "vue";
import App from "./App.vue";

import "./style.css";
import icon from "./global/icon";
import router from "./router/index";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(icon);
app.use(router);
app.use(createPinia());

app.mount("#app");

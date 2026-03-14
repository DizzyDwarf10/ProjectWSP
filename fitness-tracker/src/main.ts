import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./styles/global.css"; // optional if you have global styles

const app = createApp(App);

app.use(router);

app.mount("#app");
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/base.css";
import router from "./router/router";
import axios from "axios";
import store from "./store/store";
// при пустом url запросы автоматически идут на исходный сервер,
// поэтому коренной рут по сути не нужен
axios.defaults.baseURL = "http://91.106.207.44:3000";
// axios.defaults.baseURL = "http://localhost:3000/";

const app = createApp(App);

app.use(router);
app.use(store);
app.mount("#app");

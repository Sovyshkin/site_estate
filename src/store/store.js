import { createStore } from "vuex";
import notif from "./modules/notif";
import brone from "./modules/brone";

export default createStore({
  modules: {
    notif,
    brone,
  },
});

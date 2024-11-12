import axios from "axios";
// axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.baseURL = "";
export default {
  actions: {
    setBrone(ctx, brone) {
      ctx.commit("updateBrone", brone);
    },
  },
  mutations: {
    updateBrone(state, brone) {
      state.brone = brone;
    },
  },
  state: {
    brone: [],
  },
  getters: {
    brone(state) {
      return state.brone;
    },
  },
};

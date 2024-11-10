import axios from "axios";
// axios.defaults.baseURL = "http://localhost:3005";
axios.defaults.baseURL = "";
export default {
  actions: {
    async getNotifications(ctx, nameModel) {
      try {
        let response = await axios.post(`/notifications`, {
          nameModel: nameModel,
        });
        let notifs = response.data.s;
        ctx.commit("updateNotifs", notifs);
      } catch (e) {
        console.log(e);
      }
    },
  },
  mutations: {
    updateNotifs(state, notifs) {
      state.notifs = notifs;
    },
  },
  state: {
    notifs: 0,

    // all
    transfer: 0,
    habitation: 0,
    rental: 0,
    forChildren: 0,
    instructorTours: 0,
    events: 0,
    payments: 0,

    // habitation
    hotel: 0,
    cottage: 0,
    flat: 0,
    room: 0,
    hostel: 0,
    longterm: 0,

    // forChildren
    childrenRooms: 0,
    nanny: 0,
    otherEntertainment: 0,
    instructor: 0,

    // event
    bans: 0,
    massage: 0,
    restaurants: 0,
    nightClubs: 0,
    hoofing: 0,
    karaoke: 0,
    ratrak: 0,
    helicopter: 0,
    zoos: 0,

    // rental
    inventory: 0,
    hookah: 0,
    transport: 0,
    other: 0,

    // instructorTours
    instructorAdults: 0,
    instructorChildren: 0,
    winterTours: 0,
    summerTours: 0,

    // else
    transfers: 0,
    services: 0,
    hotels: 0,
    cards: 0,
  },
  getters: {
    notifs(state) {
      return state.notifs;
    },
  },
};

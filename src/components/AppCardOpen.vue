<script>
/* eslint-disable */
import axios from "axios";
import { defineComponent } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";

export default defineComponent({
  components: {
    Carousel,
    Slide,
    Navigation,
    Pagination,
  },
  data() {
    return {
      INFO: {},
      NUMBER: {},
      user: "",
      price: ``,
      admin: ``,
      target: 0,
      phone: "",
      fromdate: Date,
      todate: Date,
      adults: ``,
      children: ``,
      name: ``,
      category: this.$route.query.name,
      description: ``,
      value: ``,
      message: ``,
      status: ``,
      numberid: ``,
      buttonTarg: 0,
      success: "",
      paymentRef: "",
      email: "",
      view: false,
      address: ``,
      point: ``,
      edit: false,
      switch: 2,
      workbook: "",
      createn: 0,
      brony: 0,
      namebrony: {
        title: "Название",
        floor: "Этажей",
        lease_term: "Минимальный срок аренды, суток",
        total_area: "Общая площадь, кв м",
        sleeping_rooms: "Спальных комнат",
        sleeping_places: "Спальных мест основных",
        children_bed: "Детская кровать",
        double_places: "Двуспальные места",
        single_spaces: "Односпальные места",
        additional_sleeping_places: "Дополнительные спальные места",
        bathrooms: "Санузлов",
        bathrooms_showers: "Ванных/Душевых",
        transfer_mountain: "Трансфер на гору",
        transfer_city: "Трансфер с городов",
        drying_for_inventory: "Сушилка для инвентаря",
        wifi: "Wi-Fi",
        warm_floor: "Тёплый пол",
        dishwasher: "Посудомойка",
        parking_cars: "Парковка машин",
        mall: "Мангал",
        kazan: "Казан",
        bath_territory: "Баня на территории",
        pool: "Бассейн Летом/зимой",
        poolAllYear: "Есть весь год",
        poolOnlySummer: "Только в летний период",
        poolOpen: "Открытый",
        poolClose: "Крытый",
        poolHeating: "С подогревом",
        live_whith_animals: "Можно проживать с животными",
        additionally: "Дополнительно",
      },
      namebronyMain: {
        floor: "Этажей",
        lease_term: "Минимальный срок аренды, суток",
        total_area: "Общая площадь, кв м",
        sleeping_rooms: "Спальных комнат",
        wifi: "Wi-Fi",
        parking_cars: "Парковка машин",
      },
      poolInfo: {
        poolAllYear: "Есть весь год",
        poolOnlySummer: "Только в летний период",
        poolOpen: "Открытый",
        poolClose: "Крытый",
        poolHeating: "С подогревом",
      },
      index: "",
      NUMBERINDEX: "",
      floor: 0,
      lease_term: 0,
      total_area: 0,
      sleeping_rooms: 0,
      sleeping_places: 0,
      children_bed: "",
      double_places: 0,
      single_spaces: 0,
      additional_sleeping_places: 0,
      bathrooms: 0,
      bathrooms_showers: 0,
      drying_for_inventory: "",
      wifi: "",
      warm_floor: "",
      dishwasher: "",
      parking_cars: 0,
      mall: "",
      kazan: "",
      bath_territory: "",
      pool: "",
      poolAllYear: "",
      poolOnlySummer: "",
      poolOpen: "",
      poolClose: "",
      poolHeating: "",
      transfer_city: "",
      transfer_mountain: "",
      live_whith_animals: "",
      additional: "",
      title: "",
      publishRoom: 0,
      modalDelete: 0,
      id: "",
      confirm: false,
      mainInfo: [
        "Сушилка для инвентаря",
        "Wi-Fi",
        "Тёплый пол",
        "Посудомойка",
        "Мангал",
        "Казан",
        "Баня на территории",
        "Трансфер на гору",
        "",
      ],
      countReqs: 0,
      paid: false,
    };
  },
  mounted() {
    this.check_admin();
    this.loadCard();
    this.loadNumber();
    this.renderMap();
  },
  methods: {
    async renderMap() {
      await axios.get(`https://geocode-maps.yandex.ru/1.x/`, {
        params: {
          apikey: "62143967-f105-468b-b0e5-f820e63f8c40",
          geocode: `Шерегеш+${this.address}`,
          format: "json",
        },
      });
      let address = `Шерегеш ${this.address}`;
      ymaps.ready(() => {
        let myMap; // объявим переменную для карты
        function init() {
          ymaps
            .geocode(address, {
              results: 1, // количество результатов, которые вы хотите получить
            })
            .then((res) => {
              const firstGeoObject = res.geoObjects.get(0);
              const coordinates = firstGeoObject.geometry.getCoordinates();
              console.log("Координаты:", coordinates);

              myMap = new ymaps.Map("customMap", {
                center: coordinates, // устанавливаем центр карты
                zoom: 15, // масштаб карты
                behaviors: ["default", "scrollZoom"], // включаем скроллинг колесом
                controls: [], // убираем все элементы управления
              });

              const myPlacemark = new ymaps.Placemark(
                coordinates,
                {},
                {
                  preset: "islands#blueDotIcon", // выбираем иконку для точки
                }
              );

              myMap.geoObjects.add(myPlacemark); // добавляем точку на карту
            });
          // функция инициализации карты
        }
        // console.log(coord);

        init(); // инициализируем карту
      });
    },
    async loadCard() {
      this.edit = this.$route.query.edit;
      this.view = this.$route.query.view;
      this.confirm = this.$route.query.confirm;
      if (this.view == "true") {
        this.view = true;
      } else {
        this.view = false;
      }
      this.name = this.$route.query.name;
      let response = await axios.post(`/card`, {
        id: this.$route.query.id,
        name: this.name,
        view: this.view,
        clientID: this.id,
      });
      this.paid = response.data.paid;
      this.INFO = response.data.card;
      this.address = response.data.card.address
        .replace(` `, `+`)
        .replace(`, `, `+`)
        .replace(` `, `+`);
      this.countReqs = response.data.countReqs;
    },
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale("ru");
      return day.format(`dd, D MMM`);
    },
    async deleteCard() {
      await axios
        .post("/deleteCard", {
          id: this.INFO.id,
          name: this.$route.query.name,
        })
        .then((e) => {
          if (e.data.status == "200") {
            this.$router.go(-1);
          }
        });
    },
    async goEdit() {
      this.$router.push({
        path: "/create-card",
        query: {
          id: this.INFO.id,
          name: this.$route.query.name,
          edit: true,
          subcategory: this.INFO.subcategory,
        },
      });
    },
    async trybook() {
      let response = await axios.post(`/trybook`, {
        id: this.$route.query.id,
        number: this.numberid,
        phone: this.phone,
        fromdate: this.fromdate,
        todate: this.todate,
      });
      this.status = response.data.status;
      this.message = response.data.message;
      this.success = response.data.success;
      if (response.data.status == 200) {
        setTimeout(() => {
          (this.status = 0), (this.target = 0);
        }, 1500);
      }
      if (this.success) {
        this.email = this.INFO.email;
        this.fromdate = this.getDate(this.fromdate);
        this.todate = this.getDate(this.todate);
        await axios.post(`/send_mail`, {
          email: this.email,
          phone: this.phone,
          fromdate: this.fromdate,
          todate: this.todate,
        });
        console.log(this.INFO.chatID);
        await axios.post(`/send_tg`, {
          chatID: this.INFO.chatID,
          phone: this.phone,
          fromdate: this.fromdate,
          todate: this.todate,
        });
      }
    },

    async deleteNumber(id) {
      await axios
        .post("/deleteNumber", {
          id: id,
        })
        .then((e) => {
          if (e.data.status == "200") {
            this.target = 0;
            this.loadNumber();
          }
        });
    },

    async createNumber() {
      let response = await axios.post(`/create-number`, {
        title: this.title,
        hotel: this.$route.query.id,
        floor: this.floor,
        lease_term: this.lease_term,
        total_area: this.total_area,
        sleeping_rooms: this.sleeping_rooms,
        sleeping_places: this.sleeping_places,
        children_bed: this.children_bed,
        double_places: this.double_places,
        single_spaces: this.single_spaces,
        additional_sleeping_places: this.additional_sleeping_places,
        bathrooms: this.bathrooms,
        bathrooms_showers: this.bathrooms_showers,
        drying_for_inventory: this.drying_for_inventory,
        wifi: this.wifi,
        warm_floor: this.warm_floor,
        dishwasher: this.dishwasher,
        parking_cars: this.parking_cars,
        mall: this.mall,
        kazan: this.kazan,
        bath_territory: this.bath_territory,
        pool: this.pool,
        poolAllYear: this.poolAllYear,
        poolOnlySummer: this.poolOnlySummer,
        poolOpen: this.poolOpen,
        poolClose: this.poolClose,
        poolHeating: this.poolHeating,
        transfer_city: this.transfer_city,
        transfer_mountain: this.transfer_mountain,
        live_whith_animals: this.live_whith_animals,
      });
      if (response.data.status == 200) {
        (this.floor = ""),
          (this.lease_term = ""),
          (this.total_area = ""),
          (this.sleeping_rooms = ""),
          (this.sleeping_places = ""),
          (this.children_bed = ""),
          (this.double_places = ""),
          (this.single_spaces = ""),
          (this.additional_sleeping_places = ""),
          (this.bathrooms = ""),
          (this.bathrooms_showers = ""),
          (this.drying_for_inventory = ""),
          (this.wifi = ""),
          (this.warm_floor = ""),
          (this.dishwasher = ""),
          (this.parking_cars = ""),
          (this.mall = ""),
          (this.kazan = ""),
          (this.bath_territory = ""),
          (this.pool = ""),
          (this.transfer_city = ""),
          (this.transfer_mountain = ""),
          (this.live_whith_animals = ""),
          (this.buttonTarg = 1);
        setTimeout(() => {
          this.publishRoom = 0;
          this.buttonTarg = 0;
        }, 2000);
      }
    },
    async loadNumber() {
      let response = await axios.post(`/number`, {
        id: this.$route.query.id,
      });
      this.NUMBER = response.data.number;
    },

    handleVariable(variable) {
      this.target = variable.target;
      this.numberid = variable.numberid;
      console.log(variable);
    },

    async check_admin() {
      this.id = this.getCookieValue("id");
      let response = await axios.post(`/check_admin`, {
        id: this.id,
      });
      this.admin = response.data.admin;
    },

    getCookieValue(name) {
      const cookies = document.cookie.split("; ");
      let res;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        if (cookie.slice(0, 2) == name) {
          res = cookie.replace(name + "=", "");
        }
      }
      return res;
    },

    go_up() {
      this.target = 1;
      this.$refs.modal.scrollTop = 0;
    },

    goBrone() {
      this.$router.push({
        name: "bookopen",
        query: {
          cardID: this.INFO.id,
          name: "habitation",
        },
      });
    },
    async create(i) {
      await axios.post("/create-card", {
        title: this.title,
        price: this.price,
        p: this.description,
        phone: this.phone,
        address: this.address,
        email: this.email,
        chatID: this.chatID,
        subcategory: this.$route.query.name,
        category: this.$route.query.category,
        userID: this.getCookieValue("id"),

        floor: this.workbook[i]["Этажей"],
        lease_term: this.workbook[i]["Минимальный срок аренды, суток"],
        total_area: this.workbook[i]["общая площадь, кв м"],
        sleeping_rooms: this.workbook[i]["спальных комнат"],
        sleeping_places: this.workbook[i]["спальных мест основных"],
        children_bed: this.workbook[i]["Детская кровать"],
        double_places: this.workbook[i]["двуспальные места"],
        single_spaces: this.workbook[i]["односпальные места"],
        additional_sleeping_places:
          this.workbook[i]["дополнительные спальные места"],
        bathrooms: this.workbook[i]["санузлов"],
        bathrooms_showers: this.workbook[i]["ванных/душевых"],
        drying_for_inventory: this.workbook[i]["сушилка для инвентаря"],
        wifi: this.workbook[i]["Wi-Fi"],
        warm_floor: this.workbook[i]["Тёплый пол"],
        dishwasher: this.workbook[i]["посудомойка"],
        parking_cars: this.workbook[i]["парковка, машин"],
        mall: this.workbook[i]["мангал"],
        kazan: this.workbook[i]["казан"],
        bath_territory: this.workbook[i]["баня на территории"],
        pool: this.workbook[i]["Бассейн Летом/зимой"],
        poolAllYear: this.workbook[i]["Есть весь год"],
        poolOnlySummer: this.workbook[i]["Только в летний период"],
        poolOpen: this.workbook[i]["Открытый"],
        poolClose: this.workbook[i]["Крытый"],
        poolHeating: this.workbook[i]["С подогревом"],
        transfer_city: this.workbook[i]["Трансфер с городов"],
        transfer_mountain: this.workbook[i]["Трансфер на гору"],
        live_whith_animals: this.workbook[i]["Можно проживать с животными"],
        additionally: this.workbook[i]["дополнительно"],
      });
    },

    capitalized(name) {
      const capitalizedFirst = name[0].toUpperCase();
      const rest = name.slice(1);
      return capitalizedFirst + rest;
    },

    goclone() {
      this.$router.push({
        name: "createCard",
        query: { id: this.INFO.id, name: this.name },
      });
    },

    open_book() {
      this.$router.push({
        name: "bookopen",
        query: {
          cardID: this.INFO.id,
        },
      });
    },

    async backPublish() {
      let response = await axios.post(`/back_publish`, {
        id: this.INFO.id,
        name: "habitation",
      });
      this.status = response.data.status;
      this.message = response.data.message;
      setTimeout(() => {
        this.$router.go(-1);
      });
    },

    async payment() {
      let response = await axios.post(`/payment`, {
        name: this.INFO.name,
        price: this.INFO.price * 0.05,
        id: this.INFO.id,
        userID: this.INFO.userID,
      });
      this.paymentRef = response.data.paymentRef;
      this.success = response.data.success;
      if (this.success) {
        window.location.href = this.paymentRef;
      }
    },

    goCalendar() {
      this.$router.push({
        name: "calendar",
        query: { id: this.INFO.id, name: this.$route.query.name },
      });
    },

    goBooking() {
      this.$router.push({
        name: "reqBrone",
        query: {
          cardID: this.INFO.id,
          name: "habitation",
        },
      });
    },
    getImage(name) {
      try {
        return require(`/dist/assets/${name}`);
      } catch (err) {
        console.log(err);
      }
    },
  },
});
</script>

<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for -->
  <div class="card-wrapper">
    <transition name="slide-fade">
      <div
        class="info_open"
        ref="modal"
        :class="{ 'd-none': publishRoom == 0 }"
      >
        <header class="title_info">
          <button
            type="button"
            @click="publishRoom = 0"
            class="btn-close"
            aria-label="Close"
          ></button>
        </header>
        <main class="main_info">
          <div class="group">
            <span> Название: </span>
            <span>
              <input type="text" name="" id="" v-model="title" required />
            </span>
          </div>
          <div class="group">
            <span> Этажей: </span>
            <span>
              <input type="number" name="" id="" v-model="floor" required />
            </span>
          </div>
          <div class="group">
            <span> Минимальный срок аренды, суток: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="lease_term"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Общая площадь, кв м: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="total_area"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Спальных комнат: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="sleeping_rooms"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Спальных мест основных: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="sleeping_places"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Детская кровать: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="children_bed"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Двуспальные места: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="double_places"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Односпальные места: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="single_spaces"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Дополнительные спальные места: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="additional_sleeping_places"
              />
            </span>
          </div>
          <div class="group">
            <span> Санузлов: </span>
            <span>
              <input type="number" name="" id="" v-model="bathrooms" required />
            </span>
          </div>
          <div class="group">
            <span> Ванных/Душевых: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="bathrooms_showers"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Сушилка для инвентаря: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="drying_for_inventory"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Wi-Fi: </span>
            <span>
              <input type="text" name="" id="" v-model="wifi" required />
            </span>
          </div>
          <div class="group">
            <span> Тёплый пол: </span>
            <span>
              <input type="text" name="" id="" v-model="warm_floor" required />
            </span>
          </div>
          <div class="group">
            <span> Посудомойка: </span>
            <span>
              <input type="text" name="" id="" v-model="dishwasher" required />
            </span>
          </div>
          <div class="group">
            <span> Парковка, машин: </span>
            <span>
              <input
                type="number"
                name=""
                id=""
                v-model="parking_cars"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Мангал: </span>
            <span>
              <input type="text" name="" id="" v-model="mall" required />
            </span>
          </div>
          <div class="group">
            <span> Казан: </span>
            <span>
              <input type="text" name="" id="" v-model="kazan" required />
            </span>
          </div>
          <div class="group">
            <span> Баня на территории: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="bath_territory"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Бассейн Летом/зимой: </span>
            <span>
              <input type="text" name="" id="" v-model="pool" required />
            </span>
          </div>
          <div class="group">
            <span> Трансфер из городов: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="transfer_city"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Трансфер на гору: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="transfer_mountain"
                required
              />
            </span>
          </div>
          <div class="group">
            <span> Можно проживать с животными: </span>
            <span>
              <input
                type="text"
                name=""
                id=""
                v-model="live_whith_animals"
                required
              />
            </span>
          </div>
        </main>
        <div class="button-wrapper">
          <button class="publish" @click="createNumber">Опубликовать</button>
          <button
            class="btn btn-light btn-cancel"
            type="button"
            @click="publishRoom = 0"
          >
            Отмена
          </button>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div class="info_open" ref="modal" :class="{ 'd-none': createn == 0 }">
        <header class="title_info">
          <button
            type="button"
            @click="createn = 0"
            class="btn-close"
            aria-label="Close"
          ></button>
        </header>
        <main class="main_info">
          <div class="group">
            <span> Название: </span>
            <span>
              {{ INFO.title }}
            </span>
          </div>
          <div class="group">
            <span> Этажей: </span>
            <span>
              {{ INFO.floor }}
            </span>
          </div>
          <div class="group">
            <span> Минимальный срок аренды, суток: </span>
            <span>
              {{ INFO.lease_term }}
            </span>
          </div>
          <div class="group">
            <span> Общая площадь, кв м: </span>
            <span>
              {{ INFO.total_area }}
            </span>
          </div>
          <div class="group">
            <span> Спальных комнат: </span>
            <span>
              {{ INFO.sleeping_rooms }}
            </span>
          </div>
          <div class="group">
            <span> Спальных мест основных: </span>
            <span>
              {{ INFO.sleeping_places }}
            </span>
          </div>
          <div class="group">
            <span> Детская кровать: </span>
            <span>
              {{ INFO.children_bed }}
            </span>
          </div>
          <div class="group">
            <span> Двуспальные места: </span>
            <span>
              {{ INFO.double_places }}
            </span>
          </div>
          <div class="group">
            <span> Односпальные места: </span>
            <span>
              {{ INFO.single_spaces }}
            </span>
          </div>
          <div class="group">
            <span> Дополнительные спальные места: </span>
            <span>
              {{ INFO.additional_sleeping_places }}
            </span>
          </div>
          <div class="group">
            <span> Санузлов: </span>
            <span>
              {{ INFO.bathrooms }}
            </span>
          </div>
          <div class="group">
            <span> Ванных/Душевых: </span>
            <span>
              {{ INFO.bathrooms_showers }}
            </span>
          </div>
          <div class="group">
            <span> Сушилка для инвентаря: </span>
            <span v-if="INFO.drying_for_inventorydrying_for_inventory">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group">
            <span> Wi-Fi: </span>
            <span v-if="INFO.wifi">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group">
            <span> Тёплый пол: </span>
            <span v-if="INFO.warm_floor">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group">
            <span> Посудомойка: </span>
            <span v-if="INFO.dishwasher">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group">
            <span> Парковка, машин: </span>
            <span>{{ INFO.parking_cars }}</span>
          </div>
          <div class="group">
            <span> Мангал: </span>
            <span v-if="INFO.mall">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group">
            <span> Казан: </span>
            <span v-if="INFO.kazan">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group">
            <span> Баня на территории: </span>
            <span v-if="INFO.bath_territory">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group pool">
            <span> Бассейн: </span>
            <div class="groupSmall">
              <span v-if="INFO.poolAllYear">Есть весь год</span>
              <span v-if="INFO.poolOnlySummer">Только в летний период</span>
              <span v-if="INFO.poolOpen">Открытый</span>
              <span v-if="INFO.poolClose">Крытый</span>
              <span v-if="INFO.poolHeating">С подогревом</span>
            </div>
          </div>
          <div class="group">
            <span> Трансфер из городов: </span>
            <span v-if="INFO.transfer_city">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group">
            <span> Трансфер на гору: </span>
            <span v-if="INFO.transfer_mountain">да</span>
            <span v-else>нет</span>
          </div>
          <div class="group">
            <span> Можно проживать с животными:</span>
            <span v-if="INFO.live_whith_animals">да</span>
            <span v-else>нет</span>
          </div>
        </main>
        <div class="button-wrapper">
          <button
            class="btn btn-light btn-cancel"
            type="button"
            @click="createn = 0"
          >
            Закрыть
          </button>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div class="info_open" ref="modal" :class="{ 'd-none': target == 0 }">
        <header class="title_info">
          <button
            type="button"
            @click="target = 0"
            class="btn-close"
            aria-label="Close"
          ></button>
        </header>
        <main class="main_info">
          <div class="group" v-for="(item, ind) in namebrony" :key="ind">
            <span> {{ item }}: </span>
            <span v-if="item in mainInfo"></span>
            <span v-else>
              {{ NUMBERINDEX[ind] }}
            </span>
          </div>
        </main>
        <div class="button-wrapper">
          <button
            class="btn btn-light btn-cancel"
            type="button"
            @click="target = 0"
          >
            Закрыть
          </button>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div
        class="info_open"
        ref="modal"
        :class="{ 'd-none': modalDelete == 0, modalDelete: modalDelete }"
      >
        <header class="title_info">
          <button
            type="button"
            @click="modalDelete = 0"
            class="btn-close"
            aria-label="Close"
          ></button>
        </header>
        <div class="button-wrapper">
          <button @click="deleteCard" class="btn btn-danger btn-delete">
            Снять с публикации
          </button>
          <button
            class="btn btn-light btn-cancel"
            type="button"
            @click="modalDelete = 0"
          >
            Отменить
          </button>
        </div>
      </div>
    </transition>
    <div class="card">
      <!-- <div class="modalDelete" ref="modal" :class="{ 'd-none': target == 0 }">
        <div v-if="admin" class="button-wrapper">
          <button @click="deleteCard" class="delete" v-if="admin">
            Удалить
          </button>
          <button @click="target = 0" v-if="admin">Отмена</button>
        </div>
        <div v-if="!admin" class="input-wrapper">
          <form @submit.prevent="trybook">
            <input
              v-model="phone"
              type="tel"
              id="phone"
              name="phone"
              pattern="+7[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="+7 (900)-900-99-99"
              required
              v-if="!status"
            />
            <input
              type="date"
              v-model="fromdate"
              placeholder="От"
              required
              v-if="!status"
            />
            <input
              type="date"
              v-model="todate"
              placeholder="До"
              required
              v-if="!status"
            />
            <span v-if="status == 200">{{ message }}</span>
            <div class="center">
              <button class="btn btn-light" @click="go_up" v-if="!admin">
                Забронировать
              </button>
              <button
                class="btn btn-light"
                type="button"
                @click="target = 0"
                v-if="!admin"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
        <div class="infobrony" v-if="brony == 0">
          <div class="group" v-for="(item, index, i) in namebrony">
            <span> {{ item }}: </span>
            <span>
              {{ NUMBERINDEX[index] }}
            </span>
          </div>
          <div class="center">
            <button class="btn btn-light" @click="brony = 1" v-if="!admin">
              Забронировать
            </button>
            <button
              class="btn btn-light"
              type="button"
              @click="target = 0"
              v-if="!admin"
            >
              Отмена
            </button>
          </div>
          <div v-if="admin" class="button-wrapper">
            <button
              @click="deleteNumber(NUMBERINDEX.id)"
              class="delete"
              v-if="admin"
            >
              Удалить
            </button>
            <button @click="target = 0" v-if="admin">Отмена</button>
          </div>
        </div>
      </div> -->
      <div class="left">
        <div class="img">
          <Carousel :autoplay="4000" :wrap-around="true">
            <Slide v-for="slide in INFO.img" :key="slide">
              <div class="carousel__item" v-if="slide">
                <img :src="`http://sneginqd.beget.tech/${slide}`" alt="" />
              </div> </Slide
            >`

            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </Carousel>
        </div>
        <div class="info">
          <div class="nameWrapp">
            <span class="title" v-if="INFO.title">{{ INFO.title }}</span>
            <span class="price" v-if="INFO.price">{{ INFO.price }} руб</span>
          </div>
          <div
            class="group"
            v-for="(item, ind) in namebronyMain"
            :key="ind"
            v-if="INFO[ind]"
          >
            <span> {{ item }}: </span>
            <span>
              {{ INFO[ind] }}
            </span>
          </div>
          <span class="address">{{ INFO.address }}</span>
          <span class="phone">{{ INFO.phone }}</span>
          <span class="description">{{ INFO.p }}</span>
          <div class="messengers" v-if="paid">
            <a :href="'https://t.me/' + INFO.phone" target="_blank">
              <img src="assets/telegram.png" alt="telegram" />
            </a>
            <a :href="'viber://chat?number=%2B' + INFO.phone" target="_blank">
              <img src="assets/viber.png" alt="telegram" />
            </a>
            <a :href="'https://wa.me/' + INFO.phone" target="_blank">
              <img src="assets/whatsapp.png" alt="telegram" />
            </a>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="wrapper-button" v-if="!view || !admin">
          <button
            class="btn btn-info"
            v-if="category == 'habitation'"
            @click="this.createn = 1"
          >
            Полная информация
          </button>
          <button
            v-if="INFO.subcategory != 'rooms'"
            class="btn btn-light btn-rooms"
            @click="this.switch = 1"
          >
            Комнаты
          </button>
          <button class="btn btn-light btn-map" @click="this.switch = 2">
            Карта
          </button>
        </div>
        <div class="wrapper" v-if="!view">
          <div
            id="customMap"
            class="map"
            :class="{ none: this.switch == 1 }"
          ></div>
          <button class="btn publish" v-if="edit" @click="publishRoom = 1">
            Опубликовать комнату
          </button>
          <button class="btn btn-calendar" @click="goCalendar">
            Посмотреть свободные даты
          </button>
          <!-- <input
            type="file"
            ref="files"
            id="file"
            v-on:change="handleDropAsync"
            v-if="edit"
          />
          <label class="publish excel" for="file" v-if="edit">
            Опубликовать комнаты в формате Excel
          </label> -->

          <!-- <app-card
            v-if="this.switch == 1"
            v-for="(item, index) in NUMBER"
            @click="
              this.target = 1;
              brony = 0;
              this.index = index;
              this.NUMBERINDEX = NUMBER[index];
            "
            @variable="handleVariable"
            :i="index"
            :target="target"
            :title="item.name"
            :price="item.price"
            :children="item.children"
            :adults="item.adults"
            :p="item.description"
            :id="item.id"
          ></app-card> -->
          <div
            class="room"
            v-if="this.switch == 1"
            v-for="(item, index) in NUMBER"
            :key="index"
            @click="
              this.target = 1;
              brony = 0;
              this.index = index;
              this.NUMBERINDEX = NUMBER[index];
            "
          >
            <div class="roomTitle">
              {{ item.title }}
            </div>
            <div class="roomSquare">Площадь: {{ item.total_area }} кв м</div>
          </div>
          <!-- <div class="wrapper-for-map">
            <div id="customMap" class="map"></div>
          </div> -->
        </div>
        <div class="body"></div>
      </div>
      <div class="reviews"></div>
      <div class="button-wrapper" v-if="!view">
        <button v-if="edit" @click="goBooking" class="btn btn-secondary reqs">
          Запросы бронирования
          <div class="alert" v-if="countReqs">{{ countReqs }}</div>
        </button>
        <button v-if="edit" @click="goclone" class="btn btn-info">
          Клонировать объявление
        </button>
        <button @click="goEdit" class="btn btn-light" v-if="edit">
          Редактировать
        </button>
        <button v-if="id" class="btn btn-brone" @click="goCalendar">
          Забронировать
        </button>
        <button
          v-if="!id"
          class="btn btn-brone"
          @click="this.$router.push({ name: 'register' })"
        >
          Забронировать
        </button>
        <button
          @click="modalDelete = 1"
          class="btn btn-danger btn-delete"
          v-if="edit"
        >
          Снять с публикации
        </button>
        <button
          @click="deleteCardReal"
          class="btn btn-danger btn-delete"
          v-if="admin && INFO.done"
        >
          Удалить
        </button>
        <button @click="backPublish" class="btn publish" v-if="INFO.done">
          Опубликовать
        </button>
        <button @click="payment" class="btn publish" v-if="confirm">
          Опубликовать
        </button>
      </div>
    </div>
    <div v-if="message" class="notification-container">
      <div :class="{ error: status == 400, success: status == 200 }">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 3%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.success {
  background-color: #87e752;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
}
.error {
  background-color: #ed1c24;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
  font-weight: 550;
}

.btn-brone {
  background-color: #fff;
}

.btn-calendar {
  background: linear-gradient(45deg, #e0eafc, #cfdef3);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  color: black;
}

.room {
  width: 80%;
  padding: 15px 30px;
  box-shadow: 0px 0 10px 0 black;
  border-radius: 15px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: all 500ms ease;
}

.room:hover {
  transform: scale(1.06);
}

.roomTitle,
.roomSquare {
  color: #fff;
  font-weight: 500;
}

.btn-info {
  background: linear-gradient(45deg, #09203f, #537895);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  color: #fff;
}

.btn-rooms {
  background: linear-gradient(45deg, #e8cbc0, #636fa4);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  color: #fff;
}

.btn-map {
  background: linear-gradient(45deg, #bdc3c7, #2c3e50);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  color: #fff;
}

button {
  border-radius: 10px;
  transition: all 500ms;
  font-weight: 550;
}

button:hover {
  transform: scale(1.06);
}

.info_open {
  position: absolute;
  top: 5%;
  min-width: 460px;
  width: 80%;
  min-height: 288px;
  height: 60vh;
  border: 1px solid #fff;
  border-radius: 15px;
  padding: 10px 20px;
  z-index: 20;
  display: grid;
  overflow-x: hidden;
  overflow-y: scroll;
}

.group {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.groupSmall {
  padding-left: 10px;
  display: flex;
  flex-direction: column;
}

.pool {
  align-items: start;
  flex-direction: column !important;
}

.groupSmall span {
  font-size: 0.9rem !important;
}

.group span {
  font-size: 1.1rem;
  font-weight: 450;
}

.main_info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.main_info .group {
  width: 70%;
}

.main_info .group span {
  color: #000;
}
.modalDelete form {
  display: block;
}

.btn-close {
  border: none;
  position: absolute;
  right: 2%;
  top: 2%;
}

.btn-close:focus,
.btn-close:active,
.btn-close:active:focus:not(:disabled):not(.disabled) {
  box-shadow: none !important;
  outline: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

input[type="file"] {
  display: none !important;
}
.publish {
  background: linear-gradient(45deg, #56ab2f, #a8e063);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border-radius: 10px;
  width: auto !important;
  padding: 5px 10px;
  transition: all 400ms;
  color: #fff;
}

.publish:hover {
  transform: scale(1.06);
}
.excel {
  font-weight: 550;
  cursor: pointer;
}
.none {
  display: none;
}
.wrapper-button {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  z-index: 100;
}
.map {
  width: 90%;
  height: 500px;
  border: 1px solid #fff;
  box-shadow: 0px 0 10px 0 #ffffff71;
}
.info {
  overflow-y: scroll !important;
}

.right {
  width: 50%;
}

.nameWrapp {
  display: flex;
  justify-content: space-between;
}
.wrapper .card {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.left {
  width: 50%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
form {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}
.input-wrapper {
  width: 100%;
}
.input-wrapper .center {
  position: absolute;
  bottom: 20px;
  width: 100%;
  gap: 30px;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-wrapper input {
  border-radius: 10px;
  border: none;
  padding: 10px;
}
.input-wrapper form {
  padding: 50px;
  gap: 10px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  width: 100%;
}
.delete {
  background-color: rgba(230, 86, 86, 0.992);
  color: #fff;
}
.modalDelete {
  width: 60%;
  position: absolute;
  z-index: 100;
  min-width: 0;
  min-height: 0;
  background: rgb(100 100 100 / 41%);
  height: 15vh;
  border-radius: 10px;
  display: flex;
  backdrop-filter: blur(15px);
  align-items: center;
  margin: 0 auto;
  top: 50%;
  bottom: 50%;
}
.carousel {
  height: 100%;
}

@media (max-width: 426px) {
  .wrapper {
    width: 100% !important;
  }
  .card {
    overflow-y: scroll;
    height: 500px;
  }
  .left {
    width: 100%;
  }
  .right {
    width: 100%;
  }

  .img {
    width: 100% !important;
  }
}

.img {
  width: 100%;
  height: auto;
  float: left;
  position: relative;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  width: 80%;
  color: var(--mainColor);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  min-height: 400px;
}

.wrapper {
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  overflow-y: scroll;
  height: 400px;
}
.wrapper input {
  padding: 5px;
  border-radius: 10px;
  border: none;
}
.wrapper::-webkit-scrollbar {
  display: none;
}

.wrapper-for-map {
  width: 50%;
  border: 1px solid white;
}

.info span {
  font-size: 1.5rem;
  display: block;
}

.info {
}

.price {
  font-size: 1.5rem !important;
}

.card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  background: transparent;
  border: none;
  position: relative;
  width: 100%;
  max-height: 60vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.carousel__slide {
  width: 100% !important;
}

img {
  width: 100%;
  border-radius: 5px;
  height: 200px !important;
  object-fit: cover;
}

.title {
  font-size: 20px;
}

.price {
  font-size: 15px;
}

.body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 10px;
}

.messengers {
  display: flex;
  align-items: center;
  gap: 10px;
}
.messengers a {
  width: auto;
}

.messengers img {
  height: 27px !important;
  width: auto;
}

.phone {
  font-size: 1.4rem !important;
}

.address {
  font-size: 1rem !important;
}

.reqs {
  position: relative;
}

@media (max-width: 660px) {
  .left,
  .right {
    width: 100%;
  }

  .card-wrapper {
    width: 100%;
  }
}

@media (max-width: 780px) {
  .modalDelete {
    width: 100%;
  }
}
@media (min-width: 661px) and (max-width: 770px) {
  .room {
    flex-direction: column;
  }
}

@media (max-width: 995px) {
  .room {
    padding: 9px 12px;
    width: 90%;
  }

  .left,
  .right {
    width: 100%;
  }

  .button-wrapper {
    margin: 0 auto;
    flex-direction: column;
    flex-basis: 50%;
  }
}

@media (max-width: 380px) {
  .button-wrapper button {
    font-size: small;
  }
}
</style>

<script>
import AppNav from "./components/AppNav.vue";
import AppSlider from "./components/AppSlider.vue";
import AppCenter from "./components/AppCenter.vue";
import AppPhone from "./components/AppPhone.vue";
import AppAdmin from "./components/AppAdmin.vue";
import axios from "axios";

export default {
  components: {
    AppNav,
    AppSlider,
    AppCenter,
    AppPhone,
    AppAdmin,
  },
  data() {
    return {
      name: {
        "/": "Главная",
        home: "Главная",
        weather: "Погода",
        book_a_seat: "Бронирование места",
        book_a_transfer: "Бронирование трансфера",
        register: "Регистрация",
        login: "Вход",
        profile: "Профиль",
        myads: "Мои объявления",
        info: "Информация",
        "transfer-taksi": "Трансфер такси",
        habitation: "Проживание",
        habitationItems: "Комнаты проживания",
        hotels: "Гостиницы",
        cottages: "Коттеджи",
        flats: "Квартиры",
        rooms: "Комнаты",
        hostels: "Хостел",
        longterms: "На длительный срок",
        rental: "Прокат",
        rentalItems: "Прокат",
        event: "Развлечения",
        eventItems: "Развлечения",
        forChildren: "Для детей",
        forChildrenItems: "Карточки для детей",
        "instructor-tours": "Инструктор/Туры",
        instructorToursItems: "Карточки инструктор/туры",
        news: "Новости",
        ads: "Объявления",
        adsItems: "Объявления",
        transfer: "Трансфер",
        "taxi-delivery": "Такси-доставка",
        serviceCardOpen: "Такси-доставка",
        card: "Объект",
        createCard: "Публикация объекта",
        createNews: "Публикация новости",
        createTransfer: "Публикация трансфера",
        createService: "Публикация услуги",
        transfercard: "Трансфер",
        lift: "Подъемники",
        appcreatelift: "Публикация Подъемников",
        appcameras: "Камеры",
        appmap: "Карта",
        appemergency: "Экстренные службы",
        skipass: "График работы и стоимость подъёмников",
        skipasscreate: "Публикация СКИ-пасов",
        adminreq: "ADMIN Запросы",
        adminsections: "Запросы",
        adminevents: "ADMIN развлечения",
        adminforchildren: "ADMIN для детей",
        adminhabitation: "ADMIN проживание",
        admininstructortours: "ADMIN инструкторы/туры",
        adminrental: "ADMIN прокаты",
        admintransfertaksi: "ADMIN трансфер/такси",
        adminads: "ADMIN объявления",
        phonepolicy: "Политика",
        reqpayments: "Запросы на вывод средств",
        withdrawal: "Форма вывода",
        bookopen: "Бронирование",
        bindms: "Привязка",
        reqBrone: "Запросы бронирования",
        calendar: "Календарь дат",
        myreq: "Мои бронирования",
      },
      id: "",
      admin: false,
      NAMES: [
        "info",
        "transfer-taksi",
        "habitation",
        "rental",
        "event",
        "forChildren",
        "instructor-tours",
        "news",
        "ads",
      ],
      index: 0,
    };
  },
  watch() {
    this.reload();
  },
  methods: {
    reload() {
      window.location.assign(`http://sneg-info.ru`);
    },
    async notifications() {
      this.id = this.getCookieValue("id");
      let response = await axios.post(`/check_admin`, {
        id: this.id,
      });

      this.admin = response.data.admin;
    },
    namepage(el) {
      return this.name[el];
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

    go_back() {
      if (this.index == 0) {
        this.index = this.NAMES.length - 1;
      } else {
        this.index -= 1;
      }
      this.$router.push({ name: this.NAMES[this.index] });
    },

    go_up() {
      if (this.index == this.NAMES.length - 1) {
        this.index = 0;
      } else {
        this.index += 1;
      }
      this.$router.push({ name: this.NAMES[this.index] });
    },
  },
  mounted() {
    this.notifications();
  },
};
</script>

<template>
  <app-nav></app-nav>
  <app-slider></app-slider>
  <div class="site-page">
    <span @click="go_back">
      <img
        class="arrow left_arrow"
        src="./assets/arrow-down-sign-to-navigate.png"
        alt=""
      />
    </span>
    <span class="namepage">{{ namepage($route.name) }}</span>
    <span @click="go_up">
      <img
        class="arrow right_arrow"
        src="./assets/arrow-down-sign-to-navigate.png"
        alt=""
      />
    </span>
  </div>
  <app-center></app-center>
  <div class="wrapperBottom">
    <app-admin v-if="admin"> </app-admin>
    <app-phone></app-phone>
  </div>
</template>

<style>
@keyframes gradient {
  0% {
    background-position: 0, 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

.info_open {
  background: linear-gradient(45deg, #ece9e6, #fff);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  padding: 5px 15px;
}

.publish {
  background: linear-gradient(45deg, #56ab2f, #a8e063);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  border-radius: 10px;
  width: auto !important;
  padding: 5px 15px !important;
  transition: all 400ms;
  color: #fff;
  font-weight: 550;

  transition: all 500ms ease;
}

.publish:hover {
  transform: scale(1.06);
}

.btn-delete {
  background: linear-gradient(45deg, #ed213a, #93291e);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  border-radius: 10px;
  color: #fff;

  transition: all 500ms ease;
}

.btn-cancel {
  background: linear-gradient(45deg, #bdc3c7, #2c3e50);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  color: #fff;
  border-radius: 10px;

  transition: all 500ms ease;
}

.btn-find {
  background: linear-gradient(45deg, #56ccf2, #2f80ed);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  color: #fff;

  transition: all 500ms ease;
}

.btn-cancel:hover {
  transform: scale(1.06);
}

button {
  padding: 5px 7px;
  transition: all 500ms ease;
}

.btn-primary,
.btn-info {
  border-radius: 10px;
  transition: all 500ms ease !important;
}

button:hover {
  transform: scale(1.06);
}

.arrow {
  width: 30px !important;
  height: 30px !important;
}

.arrow:hover,
.arrow:active {
  filter: brightness(1000%);
}

.left_arrow {
  transform: rotate(90deg);
}

.right_arrow {
  transform: rotate(270deg);
}

.namepage {
  width: 255px;
  text-align: center;
  line-height: 20px;
}

.site-page {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: var(--mainColor);
  font-size: 1.9rem;
  margin: 20px 0 0 20px;
  z-index: 11;
}
.wrapper-main {
  height: 75vh !important;
}
.appAdmin {
  position: relative;
}
.alert {
  position: absolute;
  top: -10px;
  right: -17px;
  padding: 2px;
  background-color: #ed1c24;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 550;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s !important;
  box-shadow: inset 0 0 20px 20px #23232300 !important;
}

.done {
  position: absolute;
  right: 2%;
  bottom: 5%;
  padding: 5px 12px;
  background-color: #f7ede8;
  border-radius: 12px;
  color: #ee2e31 !important;
}

.wrapperBottom {
  position: absolute;
  width: 400px;
  bottom: 1%;
  right: 2%;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 50px;
}
@media (max-width: 400px) {
  .wrapperBottom {
    width: 90%;
    right: 4%;
  }
}

@media (max-width: 680px) {
  .arrow {
    width: 21px;
  }

  .namepage {
    width: 180px;
  }

  .site-page {
    font-size: 1.3rem;
  }
}

@media (max-width: 990px) {
  .site-page {
    font-size: 1.5rem;
  }
}

@media (max-height: 720px) {
  .wrapperBottom {
    bottom: 0%;
  }

  .list-item-name {
    font-size: 11px;
    line-height: 1.05;
  }

  .site-page {
    margin: 0;
  }
}

@media (max-height: 810px) {
  .wrapperBottom {
    bottom: -1%;
  }
}

/* input{
  color: #ffffff !important; 
} */
</style>

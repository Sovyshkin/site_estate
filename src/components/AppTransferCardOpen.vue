<script>
import axios from "axios";
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";
import dayjs from "dayjs";
import "dayjs/locale/ru";

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
      admin: ``,
      target: 0,
      todaydate: dayjs(new Date()).format(`ddd, D MMM`),
      message: "",
      status: 0,
      passenger2: 0,
      success: "",
      paymentRef: "",
      view: false,
      editB: false,
      confirm: false,
      id: "",
      countReqs: 0,
      phone: "",
    };
  },
  methods: {
    getImage(name) {
      try {
        return require(`/dist/assets/${name}`);
      } catch (err) {
        console.log(err);
      }
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

    async loadCard() {
      this.id = this.getCookieValue("id");
      this.view = this.$route.query.view;
      this.editB = this.$route.query.edit;
      this.confirm = this.$route.query.confirm;
      let response = await axios.post(`/transfer`, {
        id: this.$route.query.id,
        book: false,
        clientID: this.id,
      });
      this.INFO = response.data.transfer;
      this.passenger2 = this.INFO.passenger / 2;
      this.countReqs = response.data.countReqs;
      this.phone = response.data.phone;
      if (this.id == this.INFO.userID) {
        this.admin = true;
      } else {
        this.admin = false;
      }
      // if (this.confirm) {
      //   this.payment();
      // }
    },
    async deleteCard() {
      await axios
        .post("/delete_transfer", {
          id: this.INFO.id,
          name: this.$route.query.name,
        })
        .then((e) => {
          if (e.data.status == "200") {
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          }
        });
    },
    async edit() {
      this.$router.push({
        path: "/transfer/edit",
        query: { id: this.INFO.id, edit: true },
      });
    },

    clone() {
      this.$router.push({
        name: "createTransfer",
        query: { id: this.INFO.id, clone: true },
      });
    },

    goBrone() {
      this.$router.push({
        name: "reqBrone",
        query: {
          cardID: this.INFO.id,
          name: "transfer",
        },
      });
    },

    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale("ru");
      return day.format(`dd, D MMM`);
    },

    open_book() {
      this.$router.push({
        name: "bookopen",
        query: {
          cardID: this.INFO.id,
          name: "transfer",
        },
      });
    },

    async book() {
      let response = await axios.post(`/transfer`, {
        id: this.INFO.id,
        book: true,
      });
      this.message = response.data.message;
      this.loadCard();
    },

    async payment() {
      let response = await axios.post(`/payment`, {
        name: this.INFO.name,
        price: this.INFO.price_sit,
        id: this.INFO.id,
        userID: this.INFO.userID,
        clientID: this.id,
        category: "transfer",
      });
      this.paymentRef = response.data.paymentRef;
      this.success = response.data.success;
      if (this.success) {
        window.location.href = this.paymentRef;
      }
    },

    async backPublish() {
      let response = await axios.post(`/back_publish`, {
        name: "transfer",
        id: this.INFO.id,
      });
      this.status = response.data.status;
      this.message = response.data.message;
      setTimeout(() => {
        this.status = "";
        this.message = "";
        this.$router.go(-1);
      }, 3000);
    },

    async deleteCardReal() {
      let response = await axios.post(`/delete_transfer`, {
        id: this.INFO.id,
        real: true,
      });
      this.status = response.data.status;
      this.message = response.data.message;
      setTimeout(() => {
        this.status = "";
        this.message = "";
        this.$router.go(-1);
      }, 3000);
    },
  },
  async mounted() {
    await this.loadCard();
  },
});
</script>

<template>
  <div class="card-wrapper">
    <div class="img" v-if="INFO.img">
      <Carousel :autoplay="4000" :wrap-around="true">
        <Slide v-for="slide in INFO.img" :key="slide">
          <div class="carousel__item">
            <img :src="`http://sneginqd.beget.tech/${slide}`" alt="" />
          </div>
        </Slide>

        <template #addons v-if="INFO.img.length > 0">
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
    <div v-else class="wrap_img">
      <img src="../assets/no_image.png" alt="" class="no_image" @click="open" />
    </div>
    <div class="card">
      <div class="modalDelete" :class="{ 'd-none': target == 0 }">
        <div class="button-wrapper">
          <button @click="deleteCard" class="btn-delete" v-if="admin">
            Удалить
          </button>
          <button @click="target = 0" v-if="admin">Отмена</button>
        </div>
      </div>
      <h2>{{ getDate(INFO.datefrom) }}</h2>
      <div class="wrapper">
        <div class="start-drive"></div>
        <div class="infowrap">
          <div class="time">
            <div class="first">
              <span>{{ INFO.timefrom }}</span>
              <span class="sub">{{ getDate(INFO.datefrom) }}</span>
            </div>
          </div>
          <div class="city">
            <div class="first">
              <span>{{ INFO.cityfrom }}</span>
              <span class="sub"
                >Всего мест: {{ INFO.passenger - INFO.boardedPlaces }}</span
              >
            </div>
            <div class="second">
              <span>{{ INFO.cityto }}</span>
              <!-- <div class="wrapsvg">
                <div
                  class="circlesvg"
                  :class="{
                    green:
                      INFO.boardedPlaces < passenger2 && INFO.typeCar == `bus`,
                    green:
                      INFO.boardedPlaces < passenger2 && INFO.typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
                <div
                  class="circlesvg"
                  :class="{
                    yellow:
                      INFO.boardedPlaces >= passenger2 - 2 &&
                      INFO.boardedPlaces <= passenger2 + 2 &&
                      INFO.typeCar == `bus`,
                    yellow:
                      INFO.boardedPlaces >= passenger2 - 1 &&
                      INFO.boardedPlaces <= passenger1 + 1 &&
                      INFO.typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
                <div
                  class="circlesvg"
                  :class="{
                    red:
                      INFO.boardedPlaces <= passenger &&
                      INFO.boardedPlaces > passenger2 &&
                      INFO.typeCar == `bus`,
                    red:
                      INFO.boardedPlaces <= passenger &&
                      INFO.boardedPlaces > passenger2 &&
                      INFO.typeCar == `car`,
                  }"
                >
                  <ion-icon name="person"></ion-icon>
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <hr />
        <div class="passenger-price">
          <span>Итого за 1 пассажира {{ INFO.price_sit }} ₽</span>
        </div>
        <div class="passenger-price">
          <span>Комментарии: {{ INFO.komm }}</span>
        </div>
        <hr />
        <div class="driver">
          <span class="text-center mt-3">{{ INFO.name }}</span>
        </div>
        <div class="driver">
          <span class="text-center mt-3"
            >Длительность поездки (час): {{ INFO.length }}</span
          >
        </div>
        <div class="driver">
          <span class="text-center mt-3">Место сбора: {{ INFO.point }}</span>
        </div>
      </div>
      <div class="reviews"></div>
      <div class="button-wrapper" v-if="!view">
        <button
          v-if="!admin && id && !confirm"
          class="btn info_open"
          @click="open_book"
        >
          Забронировать
        </button>
        <button
          v-if="!id"
          class="btn info_open"
          @click="this.$router.push({ name: 'register' })"
        >
          Забронировать
        </button>
        <button v-if="editB" @click="edit" class="btn btn-light">
          Редактировать
        </button>
        <button v-if="editB" @click="clone" class="btn btn-info">
          Клонировать объявление
        </button>
        <button v-if="editB" @click="goBrone" class="btn btn-secondary">
          Запросы бронирования
          <div class="alert" v-if="countReqs">{{ countReqs }}</div>
        </button>
        <button
          @click="deleteCard"
          class="btn btn-danger btn-delete"
          v-if="admin && !INFO.done"
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
        <button
          @click="backPublish"
          class="btn btn-success publish"
          v-if="INFO.done"
        >
          Опубликовать
        </button>
        <button class="btn btn-success publish" v-if="confirm && phone">
          <a :href="`tel: ${phone}`">Связаться</a>
        </button>
        <button @click="payment" class="btn btn-success publish" v-if="confirm">
          Оплатить
        </button>
      </div>
    </div>
  </div>
  <div v-if="message" class="notification-container">
    <div :class="{ error: status == 400, success: status == 200 }">
      <span>{{ message }}</span>
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
.card {
  color: #fff;
}
.driver span {
  border-bottom: 1px solid #ffffff72;
  width: 80%;
}
.driver {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.time {
  width: 70px;
}
.city {
  width: min-content;
}
hr {
  height: 5px;
  border-radius: 20px;
  background: #fff;
}
.passenger-price {
  text-align: center;
}
.infowrap {
  display: flex;
  height: 100px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
}
.first span {
  width: 100%;
}
.first {
  height: 50%;
  display: flex;
  flex-wrap: wrap;
}
.sub {
  font-size: 13px;
  display: inline-block;
}
span:not(.sub, .cars span) {
  font-weight: 600;
  display: grid;
}
.line {
  transform: rotate(90deg);
  align-self: center;
  margin-bottom: 25px;
  left: -10px;
  max-width: 40px;
  background: black;
  position: relative;
}
.line::after {
  content: " ";
  position: absolute;
  top: -4px;
  left: -10px;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #000;
  border-radius: 100%;
}
.line::before {
  content: " ";
  position: absolute;
  bottom: -4px;
  left: 100%;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #000;
  border-radius: 100%;
}
.wrapsvg {
  width: 100%;
  display: flex;
  gap: 5px;
}
.circlesvg {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: #dedede;
}
h2 {
  width: 100%;
  text-align: center;

  transition: all 400ms;
}

h2:hover {
  color: #fff;
}

.delete {
  background-color: rgba(230, 86, 86, 0.992);
  color: #fff;
}
.modalDelete {
  width: 100%;
  position: absolute;
  z-index: 1000;
  background: rgb(100 100 100 / 41%);
  left: 0;
  height: 100%;
  border-radius: 10px;
  display: flex;
  backdrop-filter: blur(10px);
  align-items: center;
}
.carousel {
  height: 100%;
}

@media (max-width: 426px) {
  .wrapper {
    width: 100% !important;
  }
}

.img {
  width: 50%;
  height: auto;
  float: left;
  position: relative;
}

.card-wrapper {
  display: flex;
  align-items: center;
  width: 80%;
  color: var(--mainColor);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  height: 65vh;
  overflow-y: scroll;
}
.card-wrapper::-webkit-scrollbar {
  display: none;
}

.wrapper {
  padding: 10px;

  width: 100%;
}

.wrapper-for-map {
  width: 50%;
  border: 1px solid white;
}

.info span {
  font-size: 2rem;
  display: block;
}

span {
  transition: all 400ms;
}

span:hover {
  color: #fff;
}

.info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.price {
  font-size: 1.5rem !important;
}

.card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 5px;
  background: transparent;
  border: none;
  min-height: 400px;
  height: 55vh;
  position: relative;
  border-radius: 15px;
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

.description {
  margin-top: 10px;
}

.body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.button-wrapper {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

/* button {
  display: block;
  margin: 0 auto;
  border: none;
  border-radius: 10px;
  padding: 5px 7px;
  box-shadow: 0 0 10px 0 #00000037;
} */
button {
  border-radius: 10px;
  transition: all 500ms;
  font-weight: 550;
}

button:active {
  box-shadow: none;
}

.messengers {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
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

.btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn * {
  font-weight: 600;
}

@media (max-width: 1250px) {
  .card-wrapper {
    flex-direction: column;
  }
  .img {
    width: 100%;
    height: auto;
    float: left;
    position: relative;
  }
}

@media (max-width: 780px) {
  .button-wrapper {
    gap: 5px;
  }
}

@media (max-height: 700px) {
  .card-wrapper {
    height: 70vh;
    width: 95%;
  }

  .card {
    height: 70vh;
  }
}

@media (max-width: 700px) {
  .button-wrapper {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>

<script>
/* eslint-disable */
import { RouterLink } from "vue-router";
import axios from "axios";
import AppTransferCard from "/src/components/AppTransferCard.vue";
import AppService from "/src/components/AppService.vue";
import AppCard from "/src/components/AppCard.vue";

export default {
  components: {
    RouterLink,
    AppCard,
    AppService,
    AppTransferCard,
  },

  data() {
    return {
      token: "",
      id: "",
      user: "",
      active: 3,
      message: "",
      status: 200,
      services: [],
      hotels: [],
      cards: [],
      transfers: [],
      total: 0,
    };
  },
  methods: {
    async loadInfo() {
      this.id = this.getCookieValue("id");
      let response = await axios.post(`/myreq`, {
        id: this.id,
      });
      console.log(response);
      this.services = response.data.services;
      this.hotels = response.data.hotels;
      this.cards = response.data.cards;
      this.transfers = response.data.transfers;
      this.total =
        this.hotels.length +
        this.cards.length +
        this.transfers.length +
        this.services.length;
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

    open(id, name) {
      this.$router.push({
        path: "/card",
        query: { id: id, name: name },
      });
    },

    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale("ru");
      return day.format(`D MMMM, HH:mm Z UTC`);
    },

    async reject(id) {
      let response = await axios.post(`/cancel_brone`, {
        id,
      });
      this.message = response.data.message;
      this.status = response.data.status;
      setTimeout(() => {
        this.status = "";
        this.message = "";
      }, 2000);
      this.loadInfo();
    },
  },
  mounted() {
    this.loadInfo();
  },
};
</script>

<template>
  <div class="wrapper-profile">
    <div class="title">
      <router-link
        class="profile"
        :class="{ active: this.active == 1 }"
        @click="active = 1"
        to="/profile"
        ><span>Профиль</span></router-link
      >
      <router-link
        class="myads"
        :class="{ active: this.active == 2 }"
        @click="active = 2"
        to="/myads"
        ><span>Мои объявления</span></router-link
      >
      <router-link
        class="myreq"
        :class="{ active: this.active == 3 }"
        @click="active = 3"
        to="/myreq"
        ><span>Мои бронирования</span></router-link
      >
    </div>
    <div class="wrapper-card" v-if="total > 0">
      <app-transfer-card
        v-if="transfers"
        @click="
          $router.push({
            path: `/transfer/card`,
            query: {
              id: card.id,
              confirm:
                card.status == 'Ждет оплаты' || card.status == 'Оплачено',
            },
          })
        "
        v-for="(card, index) in transfers"
        :key="index"
        :i="index"
        :id="card.id"
        :name="card.name"
        :cityfrom="card.cityfrom"
        :cityto="card.cityto"
        :datefrom="card.datefrom"
        :timefrom="card.timefrom"
        :length="card.length"
        :typeCar="card.typeCar"
        :car="card.car"
        :img="card.img"
        :passenger="card.passenger"
        :passenger2="card.passenger / 2"
        :price_sit="card.price_sit"
        :price_salon="card.price_salon"
        :boardedPlaces="card.boardedPlaces"
        :done="card.done"
        :userID="card.userID"
        :status="card.status"
      >
        <!-- <div class="alert" v-if="check_brone(card.id, 'transfer')">1</div> -->
      </app-transfer-card>
      <AppService
        v-if="services"
        v-for="(cardInfo, index) in services"
        :key="index"
        :img="cardInfo.img"
        :name="cardInfo.name"
        :phone="cardInfo.phone"
        :description="cardInfo.description"
        :id="cardInfo.id"
        :i="index"
        :done="cardInfo.done"
        :status="cardInfo.status"
      />
      <AppCard
        v-for="(cardInfo, index) in cards"
        :key="index"
        v-if="cards"
        :i="index"
        :title="cardInfo.title"
        :img="cardInfo.img"
        :price="cardInfo.price"
        :p="cardInfo.p"
        :id="cardInfo.id"
        :nameCard="cardInfo.category"
        :edit="true"
        :done="cardInfo.done"
        :status="cardInfo.status"
      />

      <AppCard
        v-for="(cardInfo, index) in hotels"
        v-if="hotels"
        :key="index"
        :i="index"
        :title="cardInfo.title"
        :img="cardInfo.img"
        :price="cardInfo.price"
        :p="cardInfo.p"
        :id="cardInfo.id"
        :nameCard="cardInfo.category"
        :edit="true"
        :done="cardInfo.done"
        :status="cardInfo.status"
      />
    </div>
    <div v-if="total == 0" class="empty">
      <img src="../assets/empty.png" alt="" /><span>Пусто...</span>
    </div>
  </div>
  <div v-if="message" class="notification-container">
    <div :class="{ error: status == 400, success: status == 200 }">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter&family=Poppins:wght@400;500&display=swap");
*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  font-family: "Poppins", sans-serif;
}
* {
  color: #fff;
  transition: all 500ms ease;
}

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

.name {
  display: flex;
  gap: 5px;
}

.wrapper-for-item {
  border: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0px 0 10px 0 #ffffff71;
  margin-bottom: 10px;

  transition: all 500ms;
}

.wrapper-for-item:hover {
  background-color: transparent;
  transform: translateY(-2px);
  color: #fff;
}
.iconpng {
  width: auto;
  height: 10px;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
  gap: 10px;
}

.myreq {
  border-left: 1px solid #fff;
}

.active {
  box-shadow: 0 0 10px 0 var(--mainColor);
}

.profile,
.myads,
.myreq {
  padding: 7px;
  transition: all 400ms;
}

.profile:hover,
.myads:hover,
.myreq:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
}

span {
  transition: color 300ms;
}

span:hover {
  color: black;
}

input {
  border: none;
}
.submit {
  color: #46a71d;
  border: none;
  background: transparent;
}
.edit {
  border: none;
  background: transparent;
  color: #950707;
}

.btn-delete {
  padding: 7px 12px;
}

.group-input {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
}

input {
  color: black;
  background-color: #eeebd3;
  padding: 3px 5px;
  border-radius: 7px;
}
.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.create-transfer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.group span {
  right: 0;
}

.wrapper-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: scroll;
  gap: 20px;
}
.title {
  display: flex;
  justify-content: center;
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid #fff;
}

.title span {
  text-align: center;
  font-size: 2rem !important;
}

.wrapper-profile {
  height: 70vh;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.btn_exit {
  color: #ff1212;
  border: 1px solid #ff1212;
  background-color: transparent;
  padding: 5px 8px;
  border-radius: 15px;

  transition: all 500ms;
}

.btn_exit:hover,
.btn_exit:active,
.btn_exit:focus {
  transform: scale(1.07);
}

.wrapperTransfer {
  margin: 0 !important;
}

.wrapper-card {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px;
}

.card {
  width: 40%;
}

@media (max-width: 510px) {
  .title span {
    font-size: 1.6rem !important;
  }

  .group span {
    font-size: 1rem;
  }

  .wrapper-profile {
    width: 97%;
    padding: 0;
  }
}

@media (max-width: 1000px) {
  .title span {
    font-size: 1.6rem !important;
  }

  .card {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .title span {
    font-size: 1.2rem !important;
  }

  .create-transfer {
    flex-direction: column;
    gap: 6px;
  }
}
</style>

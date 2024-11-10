<script>
import { RouterLink } from "vue-router";
import axios from "axios";
import AppTransferCard from "/src/components/AppTransferCard.vue";
import AppService from "/src/components/AppService.vue";
import AppCard from "/src/components/AppCard.vue";

export default {
  components: {
    AppTransferCard,
    AppService,
    AppCard,
    RouterLink,
  },

  data() {
    return {
      token: "",
      id: "",
      user: "",
      active: 2,
      cards: [],
      hotels: [],
      transfers: [],
      services: [],
    };
  },
  methods: {
    async loadInfo() {
      this.id = this.getCookieValue("id");
      let response = await axios.post(`/myads`, {
        id: this.id,
      });
      this.cards = response.data.cards;
      this.hotels = response.data.hotels;
      this.transfers = response.data.transfers;
      this.services = response.data.services;
      response = await axios.post(`/profile`, {
        id: this.id,
      });
      this.notifs = response.data.cards;
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

    check_brone(id, name) {
      for (let i = 0; i < this.notifs.length; i++) {
        let notif = this.notifs[i];
        console.log(notif.cardID, id, notif.name, name);
        if (notif.cardID == id && notif.name == name) {
          console.log(notif);
          return true;
        }
      }
      return false;
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
    <div class="wrapper-group">
      <!-- eslint-disable vue/no-use-v-if-with-v-for -->
      <div class="create-transfer" v-if="id">
        <RouterLink to="/create-transfer" class="publish"
          >Опубликовать поездку</RouterLink
        >
        <RouterLink :to="`/habitation?publish=true`" class="publish">
          <!-- <div class="cross">
            <div class="line"></div>
            <div class="line"></div>
          </div> -->
          Опубликовать недвижимость
        </RouterLink>
      </div>
      <div class="wrapper-card">
        <app-transfer-card
          v-if="transfers"
          @click="
            $router.push({
              path: `/transfer/card`,
              query: { id: card.id, edit: true },
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
          :fromMyAds="true"
          :edit="true"
          :done="cardInfo.done"
        />

        <AppCard
          v-for="(cardInfo, index) in hotels"
          v-if="cards"
          :key="index"
          :i="index"
          :title="cardInfo.title"
          :img="cardInfo.img"
          :price="cardInfo.price"
          :p="cardInfo.p"
          :id="cardInfo.id"
          :nameCard="cardInfo.category"
          :fromMyAds="true"
          :edit="true"
          :done="cardInfo.done"
        />
      </div>
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

.myads {
  border-left: 1px solid #fff;
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

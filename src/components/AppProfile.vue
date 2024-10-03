<script>
import { RouterLink } from "vue-router";
import axios from "axios";

export default {
  components: {
    RouterLink,
  },

  data() {
    return {
      token: "",
      id: "",
      user: "",
      active: 1,
      telegram: true,
      viber: true,
      whatsapp: true,
      messengers: [],
      openms: "",
      cards: [],
    };
  },
  methods: {
    async load() {
      this.id = this.getCookieValue("id");
      if (this.id) {
        this.token = this.getCookieValue("token");
        let response = await axios.post(`/profile`, {
          id: this.id,
        });
        this.user = response.data.user;
        this.messengers = JSON.parse(this.user.messengers);
        this.cards = response.data.cards;
        if (this.cards.length == 0) {
          this.cards = false;
        }
        if (this.messengers) {
          this.messengers.forEach((obj) => {
            if (obj.messenger == "Telegram") {
              this.telegram = false;
            } else if (obj.messenger == "Viber") {
              this.viber = false;
            } else if (obj.messenger == "Whatsapp") {
              this.whatsapp = false;
            }
          });
        }
      } else {
        this.$router.push({ name: "login" });
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

    exit() {
      document.cookie = `token=${this.token}; max-age=0`;
      document.cookie = `id=${this.id}; max-age=0`;
      setTimeout(() => {
        location.reload();
      }, 1000);
    },

    bindms(s) {
      this.$router.push({
        name: "bindms",
        query: { messenger: s, id: this.id },
      });
    },

    open(s) {
      this.messengers.forEach((obj) => {
        if (obj.messenger == s) {
          this.openms = obj;
        }
      });
    },

    async unbind(s) {
      let response = await axios.post(`/unbind_messenger`, {
        messenger: s,
        id: this.id,
      });
      let status = response.data.status;
      if (status == 200) {
        this.openms = "";
        this.load();
      }
    },
  },
  mounted() {
    this.load();
  },
};
</script>

<template>
  <div class="open_messenger" v-if="openms">
    <div class="ms_title">{{ openms.messenger }}</div>
    <button
      type="button"
      @click="openms = ''"
      class="btn-close"
      aria-label="Close"
    ></button>
    <div class="ms_info">
      <div class="ms_group">
        <span>Имя:</span>
        <span>{{ openms.username }}</span>
      </div>
      <div class="ms_group">
        <span>Телефон:</span>
        <span>{{ openms.number }}</span>
      </div>
    </div>
    <div class="ms_footer">
      <button @click="unbind(openms.messenger)" class="btn-delete">
        Отвязать
      </button>
    </div>
  </div>
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
      >
        <div class="alert" v-if="cards">{{ cards.length }}</div>
        <span>Мои объявления</span></router-link
      >
      <router-link
        class="myads"
        :class="{ active: this.active == 3 }"
        @click="active = 3"
        to="/myreq"
        ><span>Мои бронирования</span></router-link
      >
    </div>
    <div class="wrapper-group">
      <div class="group">
        <span>Имя: </span>
        <span>{{ user.username }}</span>
      </div>
      <div class="group">
        <span>Фамилия: </span>
        <span>{{ user.surname }}</span>
      </div>
      <div class="group">
        <span>Номер: </span>
        <span>{{ user.phone }}</span>
      </div>
      <div class="group">
        <span>Email: </span>
        <span>{{ user.email }}</span>
      </div>
      <!-- <div class="group">
        <span>Баланс: </span>
        <span
          >{{ user.balance }} рублей
          <router-link to="/withdrawal">Вывести</router-link>
        </span>
      </div> -->
      <div class="group">
        <span>Мессенджеры: </span>
        <div class="messengers">
          <img
            @click="bindms('Telegram')"
            src="../assets/img/telegram.png"
            alt="telegram"
            v-if="telegram"
          />
          <img
            @click="open('Telegram')"
            src="../assets/img/telegram.png"
            alt="telegram"
            v-if="!telegram"
          />
          <img
            @click="bindms('Viber')"
            src="../assets/img/viber.png"
            alt="viber"
            v-if="viber"
          />
          <img
            @click="open('Viber')"
            src="../assets/img/viber.png"
            alt="viber"
            v-if="!viber"
          />
          <img
            @click="bindms('Whatsapp')"
            src="../assets/img/whatsapp.png"
            alt=""
            v-if="whatsapp"
          />
          <img
            @click="open('Whatsapp')"
            src="../assets/img/whatsapp.png"
            alt=""
            v-if="!whatsapp"
          />
        </div>
      </div>
    </div>
    <div class="exit">
      <button type="button" class="btn-delete" @click="exit">Выйти</button>
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
  font-size: 1.1rem;
}

.myads {
  border-left: 1px solid #fff;
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

.active {
  box-shadow: 0 0 10px 0 var(--mainColor);
  border-radius: 2px;
}

.profile,
.myads {
  padding: 7px;
  transition: all 400ms;
}

.profile:hover,
.myads:hover {
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

.open_messenger {
  position: absolute;
  height: 16vh;
  width: 300px;
  background-color: #d9d9d9;
  border-radius: 20px;
  padding: 10px 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.open_messenger * {
  color: black;
}

.ms_info {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.ms_footer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.ms_footer .btn-delete {
  font-size: 0.9rem;
  color: #fff;
}

.ms_group {
  display: flex;
  justify-content: space-between;
}

.btn-close {
  position: absolute;
  top: 5%;
  right: 5%;
}

.ms_title {
  text-align: center;
}
.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.group a {
  color: #06d6a0;
  text-decoration: underline;

  transition: all 500ms;
}

.messengers {
  display: flex;
  gap: 7px;
}

.messengers img {
  height: 30px;
  cursor: pointer;

  transition: all 500ms;
}

.messengers img:hover,
.messengers img:focus {
  transform: translateY(-5px);
}

.group a:hover,
.group a:focus {
  color: #fa824c;
  text-decoration: none;
}

.group span {
  right: 0;
  text-align: center;
}

.wrapper-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 50%;
  padding: 10px;
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
  height: 60vh;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
  gap: 50px;
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

.btn-delete {
  padding: 5px 8px;
}

.btn_exit:hover,
.btn_exit:active,
.btn_exit:focus {
  transform: scale(1.07);
}

@media (max-width: 460px) {
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
}

@media (max-width: 768px) {
  .title span {
    font-size: 1.2rem !important;
  }
}

@media (max-height: 1000px) {
  .open_messenger {
    height: 17vh;
  }
}

@media (max-height: 720px) {
  .open_messenger {
    height: 24vh;
  }
}
</style>

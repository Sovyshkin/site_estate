<script>
import { onMounted, ref } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { onClickOutside } from "@vueuse/core";

export default {
  setup() {
    let info_open = ref(false);

    onMounted(() => {
      onClickOutside(document.querySelector(".info_open"), () => {
        info_open.value = false;
      });
    });

    return {
      info_open,
    };
  },
  data() {
    return {
      requests: [],
      message: "",
      success: "",
      status: "",
      nameModel: "",
      category: "",
      info: "",
      balance: 0,
    };
  },
  methods: {
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale("ru");
      return day.format(`dd, D MMM`);
    },
    async accept(id, event) {
      event.stopPropagation();
      let response = await axios.post(`/accept_payments`, {
        id: id,
      });
      this.success = response.data.success;
      this.message = response.data.message;
      if (this.success) {
        this.request();
      }
    },
    async reject(id, event) {
      event.stopPropagation();
      let response = await axios.post(`/reject_payments`, {
        id: id,
      });
      this.success = response.data.success;
      this.message = response.data.message;
      if (this.success) {
        this.request();
      }
    },
    async request() {
      let response = await axios.post(`/request_payments`);
      this.requests = response.data.requests;
    },
    async open(id) {
      this.info_open = true;
      this.info = this.requests[id - 1];
      let response = await axios.post(`/request_payments`, {
        userID: this.info.userID,
      });
      this.balance = response.data.balance;
    },

    close_info() {
      this.info_open = false;
    },
  },
  mounted() {
    this.request();
  },
};
</script>

<template>
  <div class="wrapper">
    <div
      class="wrapper-for-item"
      @click="open(item.id)"
      v-for="item in requests"
      :key="item"
    >
      <div class="title">{{ item.username + " " + item.surname }}</div>
      <div class="date">{{ getDate(item.createdAt) }}</div>
      <div class="buttons">
        <button
          type="button"
          class="btn btn-danger btn-delete"
          @click="reject(item.id, $event)"
        >
          Отклонить
        </button>
        <button
          type="button"
          class="btn btn-success publish"
          @click="accept(item.id, $event)"
        >
          Выполнено
        </button>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="info_open" v-if="info_open">
        <header class="title_info">
          {{ info.username + " " + info.surname }}
        </header>
        <main class="main_info">
          <div class="group balance">
            <span>Текущий баланс пользователя:</span>
            <span>{{ balance }} рублей</span>
          </div>
          <div class="group amount">
            <span>Сумма вывода:</span>
            <span>{{ info.amount }} рублей</span>
          </div>
          <div class="group card_number">
            <span>Номер банковской карты:</span>
            <span>{{ info.card_number }}</span>
          </div>
          <div class="group info_date">
            <span>Запрос создан:</span>
            <span>{{ getDate(this.info.createdAt) }}</span>
          </div>
        </main>
        <button
          type="button"
          @click="close_info"
          class="btn-close"
          aria-label="Close"
        ></button>
      </div>
    </transition>
    <div v-if="requests.length == 0 || !requests" class="empty">
      <img src="../../assets/img/search.png" alt="" /><span>Пусто</span>
    </div>
  </div>
  <div v-if="message" class="notification-container">
    <div :class="{ error: !success, success: success }">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
.title_info {
  text-align: center;
  font-size: large;
  height: 20%;
}

.main_info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.group {
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group span {
  font-size: 1.1rem;
  font-weight: 450;
}

a {
  position: relative;
}
.alert {
  position: absolute;
  top: 5%;
  right: 3%;
  padding: 2px;
  color: red;
  border: 1px solid red;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.7rem;
  color: #fff;
}

.empty img {
  height: 70px;
}
.wrapper {
  width: 90%;
  height: 70vh;
  flex-basis: 100%;
  overflow-y: scroll;
  padding: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.btn {
  z-index: 10;
}

.wrapper-for-item {
  width: 100%;
  border: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0px 0 10px 0 #ffffff71;
  margin-bottom: 10px;

  transition: border 400ms;
}

.wrapper-for-item:hover {
  border: 1px solid black;
}

.title,
.date {
  color: #fff;
}

.iconpng {
  width: auto;
  height: 10px;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.info_open {
  position: absolute;
  top: 5%;
  min-width: 460px;
  width: 50%;
  min-height: 288px;
  height: 35vh;
  background-color: #f4eded;
  backdrop-filter: blur(50px);
  border: 1px solid #fff;
  border-radius: 15px;
  padding: 10px 20px;
  z-index: 20;
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

@media (max-width: 990px) {
  .info_open {
    width: 70%;
  }
}

@media (max-width: 770px) {
  .info_open {
    min-width: 400px;
    width: 60%;
  }

  .group span {
    font-size: 1rem;
    font-weight: 450;
  }
}

@media (max-width: 420px) {
  .btn {
    padding: 3px;
    font-size: small;
  }

  .info_open {
    min-width: 300px;
    width: 60%;
    height: 45vh;
  }

  .group {
    width: 100%;
  }
}
</style>

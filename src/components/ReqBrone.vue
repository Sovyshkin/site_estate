<script>
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ru";

export default {
  data() {
    return {
      requests: [],
      message: "",
      status: "",
      name: "",
      category: "",
      cardID: "",
      chatID: "",
      email: "",
    };
  },
  methods: {
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale("ru");
      return day.format(`D MMMM, HH:mm Z UTC`);
    },

    async send_mail(name) {
      await axios.post(`/send_brone`, {
        cardID: this.cardID,
        name: name,
        chatID: this.chatID,
        email: this.email,
      });
    },

    async accept(id, nameModel, event) {
      event.stopPropagation();
      let response = await axios.post(`/accept_request_brone`, {
        id: id,
        name: nameModel,
      });
      this.chatID = response.data.chatID;
      this.email = response.data.email;
      this.status = response.data.status;
      this.message = response.data.message;
      this.request();
      if (this.status == 200) {
        this.send_mail("transfer");
      }
      setTimeout(() => {
        this.message = "";
        this.status = "";
      }, 3000);
    },
    async reject(id, nameModel, event) {
      event.stopPropagation();
      let response = await axios.post(`/reject_request_brone`, {
        id: id,
        name: nameModel,
      });
      this.chatID = response.data.chatID;
      this.email = response.data.email;
      this.status = response.data.status;
      this.message = response.data.message;
      this.request();
      if (this.status == 200) {
        this.send_mail("transfer");
      }
      setTimeout(() => {
        this.message = "";
        this.status = "";
      }, 3000);
    },
    async request() {
      this.name = this.$route.query.name;
      this.category = this.$route.query.category;
      this.cardID = this.$route.query.cardID;
      let response = await axios.post(`/request_brone`, {
        name: this.name,
        category: this.category,
        cardID: this.cardID,
      });
      this.date = response.data.date;
      this.time = response.data.time;
      this.cityfrom = response.data.cityfrom;
      this.cityto = response.data.cityto;
      this.requests = response.data.reqs;
    },
    open(id) {
      this.$router.push({
        path: "/card",
        query: { id: id, name: this.$route.query.category, view: true },
      });
    },
  },
  mounted() {
    this.request();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="wrapper-for-item" v-for="item in requests" :key="item">
      <div class="info">
        <div class="title">
          <span>Имя клиента: </span>
          <span>{{ item.username }}</span>
        </div>
        <div class="places">
          <span>Количество мест: </span>
          <span>{{ item.places }}</span>
        </div>
        <div class="date">
          <span>Запрошено с </span>
          <span>{{ getDate(item.createdAt) }}</span>
        </div>
      </div>
      <div class="buttons">
        <button
          type="button"
          class="btn btn-danger btn-delete"
          @click="reject(item.id, name, $event)"
        >
          Отклонить
        </button>
        <button
          type="button"
          class="btn btn-success publish"
          @click="accept(item.id, name, $event)"
        >
          Принять
        </button>
      </div>
    </div>
    <div v-if="requests.length == 0 || !requests" class="empty">
      <img src="@/assets/img/search.png" alt="" /><span>Пусто</span>
    </div>
  </div>
  <div v-if="message" class="notification-container">
    <div :class="{ error: status == 400, success: status == 200 }">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
* {
  font-weight: 470;
}

a {
  position: relative;
}
.alert {
  position: absolute;
  top: 5%;
  right: 3%;
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
.wrapper {
  width: 90%;
  height: 70vh;
  flex-basis: 100%;
  overflow-y: scroll;
  padding: 11px;
}

.btn {
  font-size: small;
  padding: 5px 12px;
  z-index: 10;
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
  background-color: #f7ede8;

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
@media (max-width: 463px) {
  .wrapper-for-item {
    flex-direction: column;
  }

  .buttons {
    gap: 5px;
  }
}
</style>

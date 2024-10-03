<script>
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ru";

export default {
  components: {},
  data() {
    return {
      requests: [],
      message: "",
      success: "",
      status: "",
      nameModel: "",
      category: "",
    };
  },
  methods: {
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale("ru");
      return day.format(`dd, D MMM`);
    },
    async accept(id, nameModel, event) {
      event.stopPropagation();
      let response = await axios.post(`/accept_request`, {
        id: id,
        nameModel: nameModel,
      });
      this.success = response.data.success;
      this.status = response.data.status;
      this.message = response.data.message;
      if (this.success) {
        this.request();
      }
      setTimeout(() => {
        this.success = false;
        this.message = "";
        this.status = "";
      }, 2000);
    },
    async reject(id, nameModel, event) {
      event.stopPropagation();
      let response = await axios.post(`/reject_request`, {
        id: id,
        nameModel: nameModel,
      });
      this.success = response.data.success;
      this.status = response.data.status;
      this.message = response.data.message;
      if (this.success) {
        this.request();
      }
      setTimeout(() => {
        this.success = false;
        this.message = "";
        this.status = "";
      }, 2000);
    },
    async request() {
      this.nameModel = this.$route.query.nameModel;
      this.category = this.$route.query.category;
      let response = await axios.post(`/admin_requests`, {
        nameModel: this.nameModel,
        category: this.category,
      });
      this.requests = response.data.requests;
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
  <!-- eslint-disable vue/no-use-v-if-with-v-for -->
  <div class="wrapper">
    <div
      class="wrapper-for-item"
      @click="
        $router.push({
          path: `/transfer/card`,
          query: { id: item.id, view: true },
        })
      "
      v-if="nameModel == 'transfer'"
      v-for="item in requests"
      :key="item"
    >
      <div class="item">
        <div class="title">{{ item.name }}</div>
        <div class="date">{{ getDate(item.createdAt) }}</div>
        <div class="buttons">
          <button
            type="button"
            class="btn btn-danger btn-delete"
            @click="reject(item.id, nameModel, $event)"
          >
            Отклонить
          </button>
          <button
            type="button"
            class="btn btn-success publish"
            @click="accept(item.id, nameModel, $event)"
          >
            Принять
          </button>
        </div>
      </div>
    </div>

    <div
      class="wrapper-for-item"
      @click="
        $router.push({
          path: `/taxi-delivery/card`,
          query: { id: i.id, view: true },
        })
      "
      v-else-if="nameModel == 'service'"
      v-for="i in requests"
      :key="i"
    >
      <div class="title">{{ i.name }}</div>
      <div class="date">{{ getDate(i.createdAt) }}</div>
      <div class="buttons">
        <button
          type="button"
          class="btn btn-danger btn-delete"
          @click="reject(i.id, nameModel, $event)"
        >
          Отклонить
        </button>
        <button
          type="button"
          class="btn btn-success publish"
          @click="accept(i.id, nameModel, $event)"
        >
          Принять
        </button>
      </div>
    </div>

    <div
      class="wrapper-for-item 3"
      @click="open(it.id)"
      v-else
      v-for="it in requests"
      :key="it"
    >
      <div class="title">{{ it.title }}</div>
      <div class="date">{{ getDate(it.createdAt) }}</div>
      <div class="buttons">
        <button
          type="button"
          class="btn btn-danger btn-delete"
          @click="reject(it.id, nameModel, $event)"
        >
          Отклонить
        </button>
        <button
          type="button"
          class="btn btn-success publish"
          @click="accept(it.id, nameModel, $event)"
        >
          Принять
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

@media (max-width: 420px) {
  .btn {
    padding: 3px;
    font-size: small;
  }
}
</style>

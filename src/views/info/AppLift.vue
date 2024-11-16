<script>
import { RouterLink } from "vue-router";
import axios from "axios";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      LIFTS: ``,
      admin: false,
      id: "",
    };
  },
  methods: {
    async loadLift() {
      await axios.post(`/lifts`).then((e) => {
        this.LIFTS = e.data.lifts;
      });
    },

    async delete_lift(id) {
      await axios.post(`/delete_lift`, {
        id: id,
      });
      this.loadLift();
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
  },
  mounted() {
    this.check_admin();
    this.loadLift();
  },
};
</script>

<template>
  <div class="wrapperLifts">
    <div class="create-news">
      <RouterLink v-if="id" to="/lift/create-lift" class="publish"
        >Опубликовать информацию</RouterLink
      >
      <RouterLink v-if="!id" to="/register" class="publish"
        >Опубликовать информацию</RouterLink
      >
    </div>
    <div class="content">
      <div class="wrapper" v-for="item in LIFTS" :key="item">
        <div class="box">
          <div class="title">{{ item.title }}</div>
          <div class="price">{{ item.price }} ₽/разовый подъём</div>
        </div>
        <div class="box">
          <div class="text">Местоположение:</div>
          <div class="geo">{{ item.geo }}</div>
        </div>
        <div class="box">
          <div class="text">Время работы</div>
          <div class="working_hours">
            с {{ item.working_hours_start }} до {{ item.working_hours_finish }}
          </div>
        </div>
        <div class="box">
          <div class="text">Время подъёма:</div>
          <div class="lifting_time">{{ item.lifting_time }}</div>
        </div>
        <div class="box">
          <div class="text">Номер телефона:</div>
          <div class="phone">{{ item.phone }}</div>
        </div>
        <div class="delete_lift" v-if="admin">
          <button
            type="button"
            @click="delete_lift(item.id)"
            class="btn btn-danger btn-delete"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <div v-if="LIFTS.length == 0 || !LIFTS" class="empty">
      <img src="../../assets/empty.png" alt="" /><span>Пусто...</span>
    </div>
  </div>
</template>

<style scoped>
.create-news {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: sticky;
  margin-top: 10px;
  margin-bottom: 10px;
}

.divDelete {
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  margin-right: 10px;
  z-index: 10;
}

.delete_lift {
  position: absolute;
  bottom: 5%;
  right: 3%;
}

.wrapperLifts {
  margin-top: 10px;
  width: 90%;
  height: 70vh;
  overflow-y: scroll;
}

.wrapperLifts::-webkit-scrollbar {
  width: 0;
}

.content {
  width: 100%;
  padding: 7px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.wrapper {
  position: relative;
  padding: 20px;
  flex: 40%;
  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: 0px 0 10px 0 #ffffff71;

  transition: border 400ms;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.box div {
  width: 50%;
  color: var(--mainColor);
  font-weight: 600;

  transition: color 400ms;
}

.box div:hover {
  color: black;
}

.title {
  font-size: 1.5rem;
}

.price {
  font-size: 1.2rem;
}

.wrapper:hover {
  border: 1px solid black;
}

@media (max-width: 500px) {
  .price {
    font-size: 1.1rem;
  }

  .wrapper {
    padding: 10px;
  }

  .btn-delete {
    font-size: 0.8rem;
  }
}

@media (max-width: 430px) {
  .box div {
    font-size: 0.8rem;
  }
}
</style>

<script>
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ru";

export default {
  data() {
    return {
      message: "",
      status: "",
      month: [],
      index: 30,
      price_workdays: 0,
      price_weekdays: 0,
      calendar: [],
      activeCheck: false,
      id: "",
      admin: false,
    };
  },
  methods: {
    async load_info() {
      let today = new Date();
      this.month = [];
      for (let i = 0; i < 32; i++) {
        let date = new Date(today);
        date.setDate(today.getDate() + i);
        let day = dayjs(date);
        dayjs.locale("ru");
        day = day.format(`dd - D MMMM`);
        this.month.push({
          date: day,
          brone: false,
          await: false,
          active: false,
          price: 0,
        });
      }
      this.id = this.$route.query.id;
      let response = await axios.post(`/get_calendar`, {
        id: this.id,
      });
      this.calendar = response.data.calendar;
      let work = ["пн", "вт", "ср", "чт", "пт", "Mo", "Tu", "We", "Th", "Fr"];
      if (this.calendar) {
        this.calendar = JSON.parse(this.calendar);
        if (this.calendar.length > 0) {
          for (let i = 0; i < this.calendar.length; i++) {
            let cal = this.calendar[i];
            this.month[i].date = cal.date;
            this.month[i].brone = cal.brone;
            this.month[i].await = cal.await;
            this.month[i].price = cal.price;
            if (work.includes(cal.date.slice(0, 2))) {
              this.price_workdays = cal.price;
            } else {
              this.price_weekdays = cal.price;
            }
          }
        } else {
          this.calendar = this.month;
        }
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

    broneDate(id) {
      let date = this.month[id];
      if (!this.admin) {
        if (!date.brone && !date.await) {
          date.active = !date.active;
          this.check_active();
        }
      } else {
        date.active = !date.active;
        this.check_active();
      }
    },

    check_active() {
      this.activeCheck = false;
      this.activeCheck = this.month.find((item) => {
        if (item.active == true) {
          return true;
        }
      });
    },

    async check_admin() {
      let response = await axios.post(`/check_admin`, {
        id: this.getCookieValue("id"),
        cardID: this.id,
      });
      this.admin = response.data.admin;
    },

    async goBrone() {
      this.$store.dispatch("setBrone", this.month);
      this.$router.push({
        name: "bookopen",
        query: { name: this.$route.query.name, cardID: this.id },
      });
      //   for (let i = 0; i < this.month.length; i++) {
      //     let date = this.month[i];
      //     if (date.active) {
      //       this.month[i].await = true;
      //     }
      //   }
      //   let response = await axios.post(`/set_calendar`, {
      //     id: this.id,
      //     calendar: this.month,
      //   });
      //   this.status = response.data.status;
      //   this.message = response.data.message;
      //   setTimeout(() => {
      //     this.status = "";
      //     this.message = "";
      //   });
    },

    async setPrice() {
      let response = await axios.post(`/set_price`, {
        id: this.id,
        price_weekdays: this.price_weekdays,
        price_workdays: this.price_workdays,
        calendar: this.month,
      });
      this.month = JSON.parse(response.data.calendar);
    },

    async toClose() {
      let response = await axios.post(`/set_close`, {
        id: this.id,
        calendar: this.month,
      });
      this.month = JSON.parse(response.data.calendar);
      this.check_active();
    },

    async toOpen() {
      let response = await axios.post(`/set_open`, {
        id: this.id,
        calendar: this.month,
      });
      this.month = JSON.parse(response.data.calendar);
      this.check_active();
    },

    async setPriceDate(id, price) {
      let response = await axios.post(`/set_price_date`, {
        id: this.id,
        item: id,
        price: price,
        calendar: this.month,
      });
      this.month = JSON.parse(response.data.calendar);
    },
  },
  async mounted() {
    await this.load_info();
    await this.check_admin();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="month">Выберите свободные даты</div>
    <div class="price_cust" v-if="admin">
      <label for="price_workdays">Цена в будние дни</label>
      <input
        @blur="setPrice"
        v-model="price_workdays"
        type="number"
        id="price_workdays"
      />
      <label for="price_weekdays">Цена в выходные дни</label>
      <input
        @blur="setPrice"
        v-model="price_weekdays"
        type="number"
        id="price_weekdays"
      />
    </div>
    <div class="dates">
      <div
        class="date"
        v-for="(date, id) in month.slice(index - 30, index)"
        :key="id"
        :class="{
          brone: date.brone,
          active: date.active,
          await: date.await,
          admin: this.admin,
        }"
        @click="broneDate(id)"
      >
        <div class="title_date">{{ date.date }}</div>
        <div class="price_date" v-if="!admin">Цена - {{ date.price }}</div>
        <div class="price_date" v-if="admin">
          Цена -
          <input
            @blur="setPriceDate(id, date.price)"
            type="number"
            v-model="date.price"
          />
        </div>
        <div class="brone_date" v-if="!date.brone && !date.await">Свободно</div>
        <div class="brone_date" v-if="date.brone">Занято</div>
        <div class="brone_date" v-if="date.await">Забронировано</div>
      </div>
    </div>
    <div class="wrapper_btns" v-if="activeCheck">
      <button @click="goBrone" v-if="!admin" class="btn publish">
        Забронировать
      </button>
      <button @click="toClose" v-if="admin" class="btn btn-delete">
        Отметить занятыми
      </button>
      <button @click="toOpen" v-if="admin" class="btn publish">
        Отметить свободными
      </button>
    </div>
    <div v-if="message" class="notification-container">
      <div :class="{ error: status == 400, success: status == 200 }">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
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

.price_cust {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.price_date input {
  border: none;
  border-radius: 10px;
  padding: 3px 5px;
  max-width: 70px;
}

.price_cust input {
  max-width: 100px;
  padding: 5px 8px;
  border: none;
  border-radius: 10px;
}

label {
  cursor: pointer;
  color: #fff;
}
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 70vh;
  gap: 15px;
}

.month {
  color: #fff;
  font-size: 2rem;
}

.dates {
  width: 90%;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: 5px;
}

.date {
  flex: 19%;
  color: #fff;
  padding: 3px 4px;
  border: 1px solid #fff;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
  text-align: center;

  transition: all 400ms ease;
}

.date:hover {
  transform: translateY(-5px);
}

.admin {
  cursor: pointer !important;
}

.admin:hover {
  transform: translateY(-5px) !important;
}

.await {
  background-color: #ffbf69;
  border: 1px solid #ffbf69;
  color: black;
  cursor: not-allowed;

  transition: all 400ms ease;
}

.await:hover {
  transform: none;
}

.brone {
  background-color: #ed1c24;
  border: 1px solid #ed1c24;
  color: #fff;
  cursor: not-allowed;

  transition: all 400ms ease;
}

.brone:hover {
  transform: none;
}

.active {
  background-color: #f4eded;
  color: black;
}

.wrapper_btns {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>

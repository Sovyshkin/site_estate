<script>
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ru";

export default {
  data() {
    return {
      today: {},
      tomorrow: {},
      twoWeeks: {},
      month: {},
      find: `Шерегеш`,
      target: "сегодня",
      index: 0,
      weather: {},
      dayHours: [
        "2:00",
        "5:00",
        "8:00",
        "11:00",
        "14:00",
        "17:00",
        "20:00",
        "23:00",
      ],
      monthDays: [],
    };
  },
  methods: {
    async loadWeather() {
      let response = await axios.post(`/weather`, {
        city: this.find,
      });
      this.today = response.data.today;
      this.tomorrow = response.data.tomorrow;
      this.twoWeeks = response.data.twoWeeks;
      this.month = response.data.month;

      let toDay = new Date();
      this.monthDays = [];
      this.cal = true;
      for (let i = 0; i < 36; i++) {
        let date = new Date(toDay);
        date.setDate(toDay.getDate() + i);
        this.monthDays.push(date.toISOString().slice(0, 10));
      }
    },
    show_day(s) {
      let arr = s.split("-");
      s = arr.reverse().join(".");
      return s;
    },
    getDate(data) {
      dayjs.locale("ru");
      let date = new Date(data);
      let day = dayjs(date);
      return day.format(`dd, D MMM`);
    },
    dataWeather(s) {
      this.target = s;
      if (this.target == "сегодня") {
        this.weather = this.today;
      } else if (this.target == "завтра") {
        this.weather = this.tomorrow;
      } else if (this.target == "14-дней") {
        this.weather = this.twoWeeks;
      } else if (this.target == "месяц") {
        this.weather = this.month;
      }
      console.log(this.weather);
    },

    getsrc(s, t) {
      if (s) {
        if (s.toLowerCase().includes("дожд")) {
          return "rainy.png";
        } else if (
          s.toLowerCase().includes("снег") ||
          s.toLowerCase().includes("снеж")
        ) {
          return "snow.png";
        } else if (
          (s.toLowerCase().includes("ясн") ||
            s.toLowerCase().includes("безоблачно")) &&
          (t == "8:00" || t == "11:00" || t == "14:00" || t == "17:00")
        ) {
          return "sun.png";
        } else if (s.toLowerCase().includes("тум")) {
          return "foog.png";
        } else if (
          s.toLowerCase().includes("пасмурн") ||
          s.toLowerCase().includes("облачн")
        ) {
          return "cloudy.png";
        } else if (
          s.toLowerCase().includes("безоблачн") &&
          (t == "2:00" || t == "5:00" || t == "20:00" || t == "23:00")
        ) {
          return "luna.png";
        }
      } else {
        return "no.png";
      }
    },

    getTemp(tmin, tmax) {
      let n1 = parseInt(tmin);
      let n2 = parseInt(tmax);
      let sum = n1 + n2;
      console.log(tmin, n1, tmax, n2, sum);
      return Math.floor(sum / 2);
    },
  },
  mounted() {
    this.loadWeather();
  },
};
</script>

<template>
  <div class="weather-wrapper">
    <div class="wrapper-input">
      <input
        @keyup.enter="loadWeather"
        v-model="find"
        type="text"
        placeholder="Шерегеш"
      />
      <button @click="loadWeather" class="btn-find" type="submit">Поиск</button>
    </div>
    <span class="city">{{ !find ? "Шерегеш" : find }}</span>
    <div class="wrapp">
      <button
        class="btn-weather"
        :class="{ active: this.target == 'сегодня' }"
        @click="dataWeather('сегодня')"
      >
        Сегодня
      </button>
      <button
        class="btn-weather"
        :class="{ active: this.target == 'завтра' }"
        @click="dataWeather('завтра')"
      >
        Завтра
      </button>
      <button
        class="btn-weather"
        :class="{ active: this.target == '14-дней' }"
        @click="dataWeather('14-дней')"
      >
        14-дней
      </button>
      <button
        class="btn-weather"
        :class="{ active: this.target == 'месяц' }"
        @click="dataWeather('месяц')"
      >
        Месяц
      </button>
    </div>
    <div class="wrapper" v-if="weather.length < 14">
      <div class="card-weather" v-for="(item, i) in weather" :key="i">
        <span>{{ dayHours[i] }}</span>
        <img
          class="card-weather-img"
          :src="'/src/assets/img/' + getsrc(item.summary, dayHours[i])"
          alt=""
        />
        <span>{{ item.temp }}°</span>
      </div>
    </div>
    <div class="wrapper" v-if="weather.length >= 14">
      <div class="card-weather" v-for="(item, i) in weather" :key="i">
        <span class="data">{{ getDate(monthDays[i]) }}</span>
        <img
          class="card-weather-img"
          :src="'/src/assets/img/' + getsrc(item.summary, dayHours[i])"
          alt=""
        />
        <span>Мин. °C: {{ item.tmin }}°</span>
        <span>Макс. °C: {{ item.tmax }}°</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-weight: 500;
}

.card-weather {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 15px;

  transition: all 500ms ease;
}

.card-weather:hover {
  border: 1px solid #fff;
  box-shadow: 0 0 10px 0 #fff;
  transform: translateY(-2px);
}

.card-weather span {
  color: #fff;
}

.card-weather-img {
  height: 25px;
}

.wrapper {
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  height: 50vh;
  overflow-x: hidden;
  overflow-y: scroll;
}

.weather-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

input {
  background: #fff;
  outline: none;
  border: none;
  border-radius: 15px 0 0 15px;
  padding: 3px 7px;
}

.wrapper-input {
  box-shadow: 0 0 10px 0 #fff;
  border-radius: 15px;
}

.city {
  color: #fff;
  font-size: 2rem;
}

.wrapp {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-weather {
  background: #fff;
  border-radius: 15px;
  border: none;
  font-weight: 500;
  padding: 5px 12px;
  box-shadow: 0px 0 10px 0 #fff;

  transition: all 500ms ease;
}

.btn-find {
  border-radius: 0 15px 15px 0;
  padding: 3px 7px;
}

.btn-weather:hover,
.btn-weather:active,
.btn-weather:focus {
  box-shadow: 0px 0 10px 0 black;
  background: none;
  color: #fff;
  transform: translateY(-2px);
  outline: none;
}

.data {
  font-size: 1rem;
}

@media (max-width: 1000px) {
  .wrapper {
    width: 100%;
    gap: 5px;
  }
}

@media (max-width: 768px) {
  span {
    font-size: 0.7rem;
  }
}

@media (max-width: 570px) {
  .wrapper {
    gap: 0;
    height: 50vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}

@media (max-width: 480px) {
  .wrapp button {
    font-size: 0.8rem;
  }

  .wrapp {
    gap: 5px;
  }
}

@media (max-width: 300px) {
  .wrapper-input {
    display: flex;
  }
}

@media (max-height: 760px) {
  .wrapper {
    height: 41vh;
  }
}
</style>

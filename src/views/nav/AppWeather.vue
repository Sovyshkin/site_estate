<script>
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ru";

export default {
  data() {
    return {
      target: "сегодня",
      index: 0,
      days: [],
      data: [],
    };
  },
  methods: {
    async loadWeather() {
      try {
        let response = await axios.post(`/weather`);
        this.data = response.data.data;
        this.data.forEach((item) => {
          const date = this.getDate(item.dt_txt);

          const existingDay = this.days.find((day) => day.date === date);

          if (existingDay) {
            existingDay.list.push(item);
          } else {
            this.days.push({
              date,
              list: [item],
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    getDate(data) {
      try {
        dayjs.locale("ru");
        let date = new Date(data);
        let day = dayjs(date);
        return day.format(`dd, D MMM`);
      } catch (err) {
        console.log(err);
      }
    },
    // dataWeather(s) {
    //   this.target = s;
    //   if (this.data.length > 0) {
    //     if (this.target == "сегодня") {
    //       this.loadWeather();
    //     } else if (this.target == "завтра") {
    //       this.loadWeather();
    //     } else if (this.target == "14-дней") {
    //       this.loadWeather();
    //     } else if (this.target == "месяц") {
    //       this.loadWeather();
    //     }
    //   }
    // },

    getsrc(s) {
      if (s) {
        if (s.toLowerCase().includes("дожд")) {
          return "rainy.png";
        } else if (
          s.toLowerCase().includes("снег") ||
          s.toLowerCase().includes("снеж")
        ) {
          return "snow.png";
        } else if (
          s.toLowerCase().includes("ясн") ||
          s.toLowerCase().includes("безоблачно")
        ) {
          return "sun.png";
        } else if (s.toLowerCase().includes("тум")) {
          return "foog.png";
        } else if (
          s.toLowerCase().includes("пасмурн") ||
          s.toLowerCase().includes("облачн")
        ) {
          return "cloudy.png";
        }
      } else {
        return "no.png";
      }
    },

    getTemp(tmin, tmax) {
      let n1 = parseInt(tmin);
      let n2 = parseInt(tmax);
      let sum = n1 + n2;
      return Math.floor(sum / 2);
    },

    getHour(dateString) {
      try {
        // Разделяем дату и время
        if (dateString) {
          const [datePart, timePart] = dateString.split(" ");

          // Создаем объект Date из части даты
          const dateObj = new Date(datePart);

          // Получаем текущее время с учетом времени из строки
          const currentTime = new Date(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate(),
            parseInt(timePart.split(":")[0]),
            parseInt(timePart.split(":")[1].split(":")[0]),
            0
          );

          // Форматируем время в "HH:mm"
          const formattedTime =
            currentTime.getHours().toString().padStart(2, "0") +
            ":" +
            currentTime.getMinutes().toString().padStart(2, "0");

          return formattedTime;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.loadWeather();
  },
};
</script>

<template>
  <div class="weather-wrapper">
    <span class="city">Шерегеш</span>
    <!-- <div class="wrapp">
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
        :class="{ active: this.target == '5-дней' }"
        @click="dataWeather('5-дней')"
      >
        5-дней
      </button>
    </div> -->
    <div class="wrapper">
      <div class="wrap-day" v-for="item in days" :key="item.date">
        <div class="date">{{ item.date }}</div>
        <div class="weather">
          <div class="card-weather" v-for="day in item.list" :key="day.dt">
            <span>{{ getHour(day.dt_txt) }}</span>
            <img
              class="card-weather-img"
              :src="'./assets/' + getsrc(day.weather[0].description)"
              alt=""
            />
            <span>{{ day.main.temp }}°</span>
          </div>
        </div>
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
  flex-direction: column;
  align-items: center;
  gap: 20px;
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

.date {
  color: #fff;
  font-size: 1.2rem;
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

.wrap-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.weather {
  display: flex;
  align-items: center;
  gap: 10px;
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

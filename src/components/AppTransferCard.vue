<script>
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { defineComponent } from "vue";
import { Carousel, Slide } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";
export default defineComponent({
  props: {
    name: String,
    cityfrom: String,
    cityto: String,
    datefrom: String,
    timefrom: String,
    typeCar: String,
    car: String,
    img: String,
    passenger: Number,
    price_salon: Number,
    price_sit: Number,
    length: String,
    boardedPlaces: Number,
    passenger2: Number,
    done: Boolean,
  },
  components: {
    Carousel,
    Slide,
  },
  data() {
    return {
      passenger3: this.passenger / 2,
    };
  },
  methods: {
    getDate(data) {
      let date = new Date(data);
      let day = dayjs(date);
      dayjs.locale("ru");
      return day.format(`dd, D MMM`);
    },
  },
  mounted() {},
});
</script>

<template>
  <div class="cardTransfer">
    <div class="wrapinfo">
      <div class="info">
        <div class="time">
          <div class="">
            <span>{{ timefrom }}</span>
            <span class="sub">{{ getDate(datefrom) }}</span>
          </div>
          <div class="second">
            <span class="moreText"
              >Длительность поездки: {{ length }} часа</span
            >
          </div>
        </div>
        <!-- <div class="line"></div> -->
        <div class="city">
          <div class="">
            <span class="textCity">{{ cityfrom }}</span>
            <span class="sub">Мест: {{ passenger }}</span>
          </div>
          <div class="second">
            <span>{{ cityto }}</span>
            <div class="wrapsvg">
              <div
                class="circlesvg"
                :class="{
                  green: boardedPlaces < passenger3 && typeCar == `bus`,
                  green: boardedPlaces < passenger3 && typeCar == `car`,
                }"
              >
                <ion-icon name="person"></ion-icon>
              </div>
              <div
                class="circlesvg"
                :class="{
                  yellow:
                    boardedPlaces >= passenger3 - 2 &&
                    boardedPlaces <= passenger3 + 2 &&
                    typeCar == `bus`,
                  yellow:
                    boardedPlaces >= passenger3 - 1 &&
                    boardedPlaces <= passenger1 + 1 &&
                    typeCar == `car`,
                }"
              >
                <ion-icon name="person"></ion-icon>
              </div>
              <div
                class="circlesvg"
                :class="{
                  red:
                    boardedPlaces <= passenger &&
                    boardedPlaces > passenger3 &&
                    typeCar == `bus`,
                  red:
                    boardedPlaces <= passenger &&
                    boardedPlaces > passenger3 &&
                    typeCar == `car`,
                }"
              >
                <ion-icon name="person"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cars">
        <div class="img">
          <Carousel :autoplay="4000" :wrap-around="true">
            <Slide v-for="slide in img" :key="slide">
              <div class="carousel__item">
                <img class="carousel_img" :src="`/assets/` + slide" alt="" />
              </div>
            </Slide>
          </Carousel>
        </div>
        <span class="modelCar">{{ typeCar == `car` ? name : car }}</span>
      </div>
    </div>
    <div class="wrapprice">
      <div class="price">
        <span v-if="boardedPlaces != passenger">{{ price_sit }}₽</span>
        <span v-if="boardedPlaces == passenger">Нет мест</span>
      </div>
      <div class="content">
        <img src="" alt="" />
        <img src="" alt="" />
      </div>
    </div>
    <div v-if="done" class="done">Снято с публикации</div>
  </div>
</template>

<style scoped>
* {
  color: #fff;
}

.moreText {
  width: 110px;
  font-size: small;
}

.img {
  width: 25%;
  min-width: 45px;
  min-height: 45px;
}

.modelCar {
  font-size: 1rem;
  width: 70%;
}

.carousel_img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.cars {
  padding-top: 7px;
}

.time {
  width: 50%;
}
.city {
  width: 60%;
}
.cardTransfer {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  box-shadow: 0px 0px 10px 0px #2b2b2b;
  transition: all 150ms linear;
  border-radius: 12px;
  cursor: pointer;
  margin: 7px;
}
.cardTransfer:hover {
  box-shadow: 0px 5px 15px 0px #2b2b2b;
  transform: translateY(-3px);
}
.info {
  display: flex;
  gap: 15px;
  height: 100px;
  margin-bottom: 10px;
  justify-content: space-between;
}
.first span {
  width: 100%;
}
.first {
  height: 67%;
  display: flex;
  flex-wrap: wrap;
  width: 200px;
}
.sub {
  font-size: 13px;
  display: inline-block;
}
span:not(.sub, .cars span) {
  font-weight: 600;
  display: grid;
}
.line {
  transform: rotate(90deg);
  align-self: center;
  margin-bottom: 25px;
  left: -10px;
  max-width: 40px;
  background: black;
  position: relative;
}
.line::after {
  content: " ";
  position: absolute;
  top: -4px;
  left: -10px;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #000;
  border-radius: 100%;
}
.line::before {
  content: " ";
  position: absolute;
  bottom: -4px;
  left: 100%;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid #000;
  border-radius: 100%;
}
.wrapsvg {
  width: 100%;
  display: flex;
  gap: 5px;
}
.circlesvg {
  width: 25px;
  height: 25px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: #dedede;
}
.cars {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cars .circlesvg {
  width: 30px;
  height: 30px;
}
.price {
  font-size: 15px !important;
}
.price .sub {
  text-align: end;
  text-decoration: line-through;
  text-decoration-thickness: 1.3px;
  text-decoration-color: #3b3b3b;
}
.green {
  background: #5cd166;
}
.yellow {
  background: #ffcd57;
}
.red {
  background: #ee2e31;
}
@media (max-width: 1000px) {
  .cardTransfer {
    width: 70%;
  }
}

@media (max-width: 770px) {
  .cardTransfer {
    width: 100%;
  }
  .container {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .info {
    min-width: 200px;
  }
}

@media (max-width: 400px) {
  .first {
    width: 85px;
    word-break: break-all;
  }
  .cardTransfer {
    padding: 8px;
  }
}
</style>

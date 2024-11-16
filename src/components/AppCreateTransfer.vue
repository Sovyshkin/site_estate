<script>
import axios from "axios";
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";

export default defineComponent({
  components: {
    Carousel,
    Slide,
    Navigation,
    Pagination,
  },

  data() {
    return {
      show: false,
      message: "",
      nametransfer: "",
      cityfrom: "",
      cityto: "",
      datefrom: new Date().toLocaleDateString("en-CA"),
      timefrom: "17:30",
      typeCar: "",
      car: "",
      passenger: "",
      price_sit: "",
      komm: "",
      length: "",
      status: ``,
      point: ``,
      regions: [
        {
          name: "Кемеровская область",
          cities: [
            "Кемерово",
            "Новокузнецк",
            "Шерегеш",
            "Прокопьевск",
            "Междуреченск",
            "Ленинск-Кузнецкий",
            "Киселёвск",
            "Юрга",
            "Белово",
            "Анжеро-Судженск",
            "Берёзовский",
            "Осинники",
            "Мыски",
            "Мариинск",
            "Топки",
            "Полысаево",
            "Тайга",
            "Таштагол",
            "Гурьевск",
            "Калтан",
            "Салаир",
          ],
        },
        {
          name: "Томская область",
          cities: [
            "Томск",
            "Асино",
            "Бакчар",
            "Белый Яр",
            "Зырянское",
            "Каргасок",
            "Кожевниково",
            "Колпашево",
            "Кривошеино",
            "Молчаново",
            "Парабель",
            "Первомайское",
            "Тегульдет",
            "Подгорное",
            "Мельниково",
          ],
        },
        {
          name: "Республика Горный Алтай",
          cities: [
            "Горно-Алтайск",
            "Кош-Агач",
            "Майма",
            "Онгудай",
            "Турочак",
            "Улаган",
            "Усть-Кан",
            "Усть-Кокса",
            "Чемал",
            "Чоя",
            "Шебалино",
          ],
        },
        {
          name: "Алтайский край",
          cities: [
            "Барнаул",
            "Бийск",
            "Змеиногорск",
            "Рубцовск",
            "Алейск",
            "Горняк",
            "Камень-на-Оби",
            "Славгород",
            "Белокуриха",
            "Заринск",
            "Новоалтайск",
            "Яровое",
            "Алтайское",
            "Баево",
            "Благовещенка",
            "Бурла",
            "Быстрый Исток",
            "Волчиха",
            "Новоегорьевское",
            "Ельцовка",
            "Завьялово",
            "Залесово",
            "Зональное",
            "Калманка",
            "Ключи",
            "Косиха",
            "Красногорское",
            "Краснощёково",
            "Крутиха",
            "Кулунда",
            "Курья",
            "Кытманово",
            "Мамонтово",
            "Михайловский",
            "Гальбштадт",
            "Новичиха",
            "Павловск",
            "Панкрушиха",
            "Петропавловское",
            "Поспелиха",
            "Ребриха",
            "Родино",
            "Романово",
            "Смоленское",
            "Верх-Суетка",
            "Советское",
            "Солонешное",
            "Солтон",
            "Шелаболиха",
            "Табуны",
            "Тальменка",
            "Тогул",
            "Топчиха",
            "Староалейское",
            "Троицкое",
            "Тюменцево",
            "Угловское",
            "Усть-Калманка",
            "Усть-Чарышская Пристань",
            "Хабары",
            "Целинное",
            "Чарышское",
            "Шипуново",
          ],
        },
        {
          name: "Новосибирская область",
          cities: [
            "Новосибирск",
            "Болотное",
            "Каргат",
            "Обь",
            "Черепаново",
            "Барабинск",
            "Искитим",
            "Куйбышев",
            "Татарск",
            "Чулым",
            "Бердск",
            "Карасук",
            "Купино",
            "Тогучин",
            "Баган",
            "Венгерово",
            "Довольное",
            "Здвинск",
            "Колывань",
            "Коченево",
            "Кочки",
            "Краснозерское",
            "Кыштовка",
            "Маслянино",
            "Мошково",
            "Ордынское",
            "Северное",
            "Сузун",
            "Убинское",
            "Усть-Тарка",
            "Чаны",
            "Чистоозерное",
          ],
        },
        {
          name: "Красноярский край",
          cities: [
            "Красноярск",
            "Боготол",
            "Енисейск",
            "Иланский",
            "Лесосибирск",
            "Норильск",
            "Уяр",
            "Артемовск",
            "Бородино",
            "Заозерный",
            "Канск",
            "Минусинск",
            "Сосновоборск",
            "Шарыпово",
            "Ачинск",
            "Дивногорск",
            "Игарка",
            "Кодинск",
            "Назарово",
            "Ужур",
            "Балахта",
            "Березовка",
            "Новобирилюссы",
            "Богучаны",
            "Большая Мурта",
            "Большой Улуй",
            "Дзержинское",
            "Емельяново",
            "Ермаковское",
            "Идринское",
            "Ирбейское",
            "Казачинское",
            "Каратузское",
            "Козулька",
            "Краснотуранск",
            "Курагино",
            "Шалинское",
            "Мотыгино",
            "Нижний Ингаш",
            "Новоселово",
            "Партизанское",
            "Пировское",
            "Агинское",
            "Северо-Енисейский",
            "Сухобузимское",
            "Тасеево",
            "Туруханск",
            "Тюхтет",
            "Шушенское",
          ],
        },
        {
          name: "Омская область",
          cities: [
            "Омск",
            "Называевск",
            "Исилькуль",
            "Тара",
            "Калачинск",
            "Тюкалинск",
            "Азово",
            "Большеречье",
            "Большие Уки",
            "Горьковское",
            "Знаменское",
            "Исилькуль",
            "Калачинск",
            "Колосовка",
            "Кормиловка",
            "Крутинка",
            "Любинский",
            "Марьяновка",
            "Москаленки",
            "Муромцево",
            "Называевск",
            "Нижняя Омка",
            "Нововаршавка",
            "Одесское",
            "Оконешниково",
            "Ростовка",
            "Павлоградка",
            "Полтавка",
            "Русская Поляна",
            "Саргатское",
            "Седельниково",
            "Таврическое",
            "Тара",
            "Тевриз",
            "Тюкалинск",
            "Усть-Ишим",
            "Черлак",
            "Шербакуль",
          ],
        },
      ],
      region: null,
      city: null,
      regionTo: null,
      cityTo: null,
      img: "",
      files: "",
      error: "",
      clone: false,
      id: "",
    };
  },
  methods: {
    handleFilesUpload() {
      if (this.clone) {
        this.img = ``;
        if (this.files) {
          let files = Array.from(this.files);
          let newFiles = Array.from(this.$refs.files.files);
          newFiles.forEach((item) => {
            files.push(item);
          });
          this.files = files;
        } else {
          this.files = this.$refs.files.files;
        }
      } else {
        if (this.files) {
          let files = Array.from(this.files);
          let newFiles = Array.from(this.$refs.files.files);
          newFiles.forEach((item) => {
            files.push(item);
          });
          this.files = files;
        } else {
          this.files = this.$refs.files.files;
        }
      }
    },
    async submitFiles() {
      if (this.clone) {
        let response = await axios.post(`/clone_transfer`, {
          name: this.nametransfer,
          region: this.region.name,
          cityfrom: this.city,
          regionTo: this.regionTo.name,
          cityto: this.cityTo,
          datefrom: this.datefrom,
          timefrom: this.timefrom,
          typeCar: this.typeCar,
          car: this.car,
          passenger: this.passenger,
          komm: this.komm,
          price_sit: this.price_sit,
          length: this.length,
          point: this.point,
          userID: this.getCookieValue("id"),
          img: this.img,
        });
        this.status = response.data.status;
        this.message = response.data.message;
        this.success = response.data.success;
        if (this.success) {
          setTimeout(() => {
            this.error = "";
            this.status = "";
            this.$router.go(-1);
          }, 2500);
        }
      } else {
        let formData = new FormData();
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          formData.append("files", file);
        }
        await axios
          .post(`/create_transfer`, {
            name: this.nametransfer,
            region: this.region.name,
            cityfrom: this.city,
            regionTo: this.regionTo.name,
            cityto: this.cityTo,
            datefrom: this.datefrom,
            timefrom: this.timefrom,
            typeCar: this.typeCar,
            car: this.car,
            passenger: this.passenger,
            komm: this.komm,
            price_sit: this.price_sit,
            length: this.length,
            point: this.point,
            userID: this.getCookieValue("id"),
          })
          .then((e) => {
            console.log(`card creation return: ${e.data.text}`);

            let routeAppend = new String();

            console.log(`response info is: ${e.data.message}`);
            if (!isNaN(e.data.message))
              routeAppend = `?id=${e.data.message}&model=transfer`;

            let uploadRoute = `/upload${routeAppend}`;

            console.log(`card creation response ${e.data.message}`);
            console.log(`upload route is ${uploadRoute}`);

            axios
              .post(uploadRoute, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((e) => {
                console.log(`got code 200 on upload: ${e.data.text}`);
              })
              .catch((e) => {
                console.log(`got code 400 on upload: ${e.data.text}`);
              });
            this.error = e.data.error;
            this.status = e.data.status;
            this.success = e.data.success;
            if (this.success) {
              setTimeout(() => {
                this.error = "";
                this.status = "";
                this.$router.go(-1);
              }, 2500);
            }
          });
      }
      // if (this.status == "200") {
      //   this.$router.push({ name: this.$route.query.name });
      // }
    },
    url(file) {
      return URL.createObjectURL(file);
    },
    remove(file) {
      let files = Array.from(this.files);
      files.forEach((el, i) => {
        if (el.name == file.name) {
          files.splice(i, 1);
        }
      });
      this.files = files;
      if (this.edit) {
        console.log(file);
        this.img.forEach((el, i) => {
          if (file.name == el.name) {
            this.img.splice(i, 1);
          }
        });
      }
    },

    showMessage(message) {
      this.message = message;
      this.show = true;
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

    async notifications() {
      let response = await axios.post(`/notifications`, {
        nameModel: "reqAll",
      });

      this.$emit("updateS", response.data.s);
    },

    async checkClone() {
      this.clone = this.$route.query.clone;
      if (this.clone) {
        this.id = this.$route.query.id;
        let response = await axios.post(`/clone_card`, {
          id: this.id,
        });
        let card = response.data.card;
        if (card) {
          this.nametransfer = card.name;
          this.region = this.findRegionCity(card.region, "region");
          this.city = this.findRegionCity(card.cityfrom, "city");
          this.regionTo = this.findRegionCity(card.regionTo, "region");
          this.cityTo = this.findRegionCity(card.cityto, "cityTo");
          this.point = card.point;
          this.datefrom = card.datefrom;
          this.timefrom = card.timefrom;
          this.length = card.length;
          this.typeCar = card.typeCar;
          this.car = card.car;
          this.passenger = card.passenger;
          this.komm = card.komm;
          this.price_sit = card.price_sit;
          console.log(card.img);
          this.img = card.img;
        }
      }
    },

    findRegionCity(s, f) {
      if (f == "region") {
        let foundRegion = this.regions.find((obj) => obj.name == s);
        return foundRegion;
      } else if (f == "city") {
        let foundCity;
        this.region.cities.forEach((city) => {
          if (city == s) {
            foundCity = city;
          }
        });
        return foundCity;
      } else if (f == "cityTo") {
        let foundCityTo;
        this.regionTo.cities.forEach((city) => {
          if (city == s) {
            foundCityTo = city;
          }
        });
        return foundCityTo;
      }
    },
    getImage(name) {
      try {
        return require(`/dist/assets/${name}`);
      } catch (err) {
        console.log(err);
      }
    },
  },
  async mounted() {
    await this.checkClone();
  },
});
</script>

<template>
  <div class="wrapper">
    <form @submit.prevent="submitFiles">
      <div class="wrapper-for-form">
        <div class="col1">
          <div class="img">
            <!-- <button @click="files = ``" class="cross">
              <ion-icon name="close-outline"></ion-icon>
            </button> -->
            <input
              type="file"
              ref="files"
              id="file"
              multiple
              accept="image/*"
              v-on:change="handleFilesUpload"
            />
            <label for="file">
              <div class="line">
                <img src="../assets/img_add.png" alt="" />
              </div>
            </label>

            <Carousel v-if="files != ``" :autoplay="4000" :wrap-around="true">
              <Slide v-for="slide in files" :key="slide">
                <div class="carousel__item">
                  <div class="imgCross">
                    <img :ref="url(slide)" :src="url(slide)" alt="" />
                    <button @click="remove(slide)" class="cross">
                      <ion-icon name="close-outline"></ion-icon>
                    </button>
                  </div>
                </div>
              </Slide>

              <template #addons>
                <Navigation />
                <Pagination />
              </template>
            </Carousel>

            <Carousel v-if="img != ``" :autoplay="4000" :wrap-around="true">
              <Slide v-for="slide in img" :key="slide">
                <div class="carousel__item">
                  <div class="imgCross">
                    <img :src="`http://sneginqd.beget.tech/${slide}`" alt="" />
                    <button @click="remove(slide)" class="cross">
                      <ion-icon name="close-outline"></ion-icon>
                    </button>
                  </div>
                </div>
              </Slide>

              <template #addons>
                <Navigation />
                <Pagination />
              </template>
            </Carousel>
          </div>
          <div class="input-group">
            <div class="title">Имя:</div>
            <div class="wrapper-for-input">
              <input
                v-model="nametransfer"
                type="text"
                name="name"
                class="form-input name"
                required
                id=""
              />
            </div>
          </div>
          <div class="input-group">
            <div class="title">Регион (откуда):</div>
            <div class="wrapper-for-input">
              <select v-model="region">
                <option v-for="region in regions" :value="region" :key="region">
                  {{ region.name }}
                </option>
              </select>
            </div>
          </div>
          <div
            class="input-group"
            :class="{ active: this.region, 'd-none': !this.region }"
          >
            <div class="title">Город:</div>
            <div class="wrapper-for-input" v-if="region">
              <select v-model="city">
                <option v-for="city in region.cities" :value="city" :key="city">
                  {{ city }}
                </option>
              </select>
            </div>
          </div>

          <div class="input-group">
            <div class="title">Регион (куда):</div>
            <div class="wrapper-for-input">
              <select v-model="regionTo">
                <option v-for="region in regions" :value="region" :key="region">
                  {{ region.name }}
                </option>
              </select>
            </div>
          </div>
          <div
            class="input-group"
            :class="{ active: this.regionTo, 'd-none': !this.regionTo }"
          >
            <div class="title">Город:</div>
            <div class="wrapper-for-input" v-if="regionTo">
              <select v-model="cityTo">
                <option
                  v-for="city in regionTo.cities"
                  :value="city"
                  :key="city"
                >
                  {{ city }}
                </option>
              </select>
            </div>
          </div>
          <div class="input-group">
            <div class="title">Место сбора:</div>
            <div class="wrapper-for-input">
              <input
                v-model="point"
                type="text"
                name="cityto"
                class="form-input cityto"
                required
                id=""
              />
            </div>
          </div>
          <div class="input-group">
            <div class="title">Дата отъезда:</div>
            <div class="wrapper-for-input">
              <input
                v-model="datefrom"
                type="date"
                name="datefrom"
                class="form-input datefrom"
                required
                id=""
              />
            </div>
          </div>
        </div>
        <div class="col1">
          <div class="input-group">
            <div class="title">Время отъезда:</div>
            <div class="wrapper-for-input">
              <input
                v-model="timefrom"
                pattern="\d{1,2}:\d{1,2}"
                type="text"
                name="timefrom"
                class="form-input timefrom"
                required
                id=""
              />
            </div>
          </div>
          <div class="input-group">
            <div class="title">Продолжи<br />тельность поездки (часов):</div>
            <div class="wrapper-for-input">
              <input
                v-model="length"
                type="text"
                name="cityto"
                class="form-input cityto"
                required
                id=""
              />
            </div>
          </div>
          <div class="input-group">
            <div class="title">Тип машины:</div>
            <div class="wrapper-for-input">
              <select
                v-model="typeCar"
                name="typeCar"
                class="form-select form-input typeCar"
                required
                aria-label="Default select example"
              >
                <option value="sedan">Седан</option>
                <option value="universal">Универсал</option>
                <option value="cross">Кроссовер</option>
                <option value="miniven">Минивен</option>
                <option value="bus">Автобус</option>
              </select>
            </div>
          </div>
          <div class="input-group">
            <div class="title">Модель машины:</div>
            <div class="wrapper-for-input">
              <input
                v-model="car"
                type="text"
                name="car"
                class="form-input"
                required
                id=""
              />
            </div>
          </div>
          <div class="input-group">
            <div class="title titleMore">Количество пассажиров в машине:</div>
            <div class="wrapper-for-input">
              <input
                v-model="passenger"
                type="number"
                name="passenger"
                class="form-input passenger"
                required
                id=""
              />
            </div>
          </div>
          <div class="input-group">
            <div class="title">Цена за место (руб):</div>
            <div class="wrapper-for-input">
              <input
                v-model="price_sit"
                type="number"
                name="price"
                class="form-input price"
                required
                id=""
              />
            </div>
          </div>

          <div class="input-group">
            <div class="title">Комментарии:</div>
            <div class="wrapper-for-input">
              <textarea
                v-model="komm"
                name="komm"
                class="form-input komm"
                required
                id=""
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="error" class="notification-container">
        <div :class="{ error: status == 400, success: status == 200 }">
          <span>{{ error }}</span>
        </div>
      </div>
      <div v-else class="div-for-button">
        <button class="publish">Опубликовать</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(100%);
}
::-webkit-scrollbar {
  display: block;
}

#file {
  display: none;
}
label {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  border: 1px solid var(--mainColor);
  border-radius: 10px;
  max-height: 50px !important;
  min-height: 50px;
}

.line img {
  width: 50px !important;
  height: 50px !important;
}

.carousel {
  height: 100%;
}
.carousel {
  height: 100%;
}
.carousel__item {
  min-height: 200px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
}
.carousel__slide {
  width: 100% !important;
}

.line img {
  width: 50px !important;
  height: 50px !important;
}
.cross {
  color: red;
  z-index: 20;
  background: transparent;
  border: none;
  box-shadow: none;
  height: auto;
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 500ms;
}

.d-none {
  display: none;
  opacity: 0;

  transition: all 500ms;
}

.active {
  display: block;
  opacity: 1;

  transition: all 500ms;
}

.cross:hover {
  transform: scale(1.4);
}

.imgCross {
  position: relative;
}

@media (max-width: 426px) {
  .img {
    width: 100% !important;
  }
}

.img {
  width: 80%;
  height: auto;
  float: left;
  position: relative;
  min-height: 50px;
  margin: 0 auto;
}

img {
  width: 100%;
  border-radius: 5px;
  height: 200px !important;
  object-fit: cover;
}

/* Трансфер */
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  height: 65vh;
}

form {
  height: 70vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
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
.titlebody {
  color: #d5d5d5;
  font-weight: 600;
  position: absolute;
  top: 0%;
  margin-top: 15px;
  font-size: large;
}

.wrapper-for-input {
  width: 50%;
}

.input-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.input-group .title:hover {
  color: black;
}

.title {
  color: #d5d5d5;
  font-weight: 600;
  line-height: 19px !important;
  text-align: end;
  width: 30%;

  transition: color 300ms;
}

.input-group .form-input {
  width: 100%;
}

input,
select {
  border-radius: 5px;
}

.form-input {
  padding: 5px 7px;
  background-color: transparent;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  color: #fff;

  transition: color 300ms;
}

.form-input::placeholder {
  text-align: center;
  font-weight: 500;
  color: #d5d5d5;
}

.form-input:focus,
.form-input:hover {
  color: #d5d5d5;
}

.div-for-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper-for-form {
  width: 100%;
  gap: 10px;
  display: flex;
  justify-content: center;
  height: fit-content;
  padding: 8px;
  overflow-y: scroll;
  overflow-x: hidden;
}

select {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  color: black;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  padding: 2px;

  transition: all 500ms;
}

.col1 {
  width: 45%;
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.telegramBot {
  padding: 7px;
}

.telegramBot a {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-direction: row;

  transition: all 400ms;
}

.telegramBot img:hover {
  transform: scale(1.07);
}

.text {
  font-size: 0.9rem !important;
}

.teleg {
  height: 40px !important;
  width: 40px;

  transition: all 400ms;
}

@media screen and (width <=200px) {
  .col1 {
    gap: 5px;
  }

  .title {
    font-size: small;
    width: 20%;
    text-align: end;
    line-height: 0.8;
  }

  .titleMore {
    font-size: 10px;
  }

  .wrapper-for-input {
    margin-left: 10px;
  }

  .input-group {
    gap: 30px;
  }
}

@media (max-width: 420px) {
  .container {
    display: flex;
  }
}

@media (max-width: 770px) {
  .wrapper {
    position: relative;
    top: 0;
    flex-direction: column;
  }

  .col1 {
    width: 100%;
  }

  .title {
    line-height: 16px;
  }
}

@media (max-width: 540px) {
  .wrapper-for-form {
    flex-direction: column;
  }
}
</style>

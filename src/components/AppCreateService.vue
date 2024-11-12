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
      files: ``,
      img: "",
      name: this.$route.query.name,
      phone: ``,
      description: ``,
      status: ``,
      error: ``,
      INFO: {},
      edit: false,
    };
  },
  mounted() {
    this.loadCard();
  },
  methods: {
    async create() {},
    handleFilesUpload() {
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
    async submitFiles() {
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("files", file);
      }
      await axios
        .post("/create_service", {
          name: this.name,
          phone: this.phone,
          description: this.description,
          userID: this.getCookieValue("id"),
        })
        .then((e) => {
          console.log(`card creation return: ${e.data.text}`);

          let routeAppend = new String();

          console.log(`response info is: ${e.data.message}`);
          if (!isNaN(e.data.message))
            routeAppend = `?id=${e.data.message}&model=taxi`;

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
            }, 2000);
          }
        });
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
    async editCard() {
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("files", file);
      }
      await axios
        .post(`/create-card`, {
          img: this.img,
          id: this.$route.query.id,
          name: this.name,
          price: this.price,
          p: this.description,
          phone: this.phone,
          address: this.address,
          edit: true,
        })
        .then((e) => {
          if (formData) {
            axios
              .post("/upload", formData, {
                params: {
                  id: this.$route.query.id,
                  name: this.$route.query.name,
                },
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(function () {
                console.log("SUCCESS!!");
              })
              .catch(function () {
                console.log("FAILURE!!");
              });
            this.error = e.data.message;
            this.status = e.data.status;
            this.success = e.data.success;
          }
          if (e.data.status == "200") {
            this.$router.go(-1);
          }
        });
    },
    async loadCard() {
      let id = this.$route.query.id;
      let name = this.$route.query.name;
      if (id && name) {
        let response = await axios.post(`/card`, {
          id: id,
          name: name,
        });
        this.edit = this.$route.query.edit;
        this.INFO = response.data.card;
        this.img = this.INFO.img;
        this.title = this.INFO.title;
        this.price = this.INFO.price;
        this.phone = this.INFO.phone;
        this.address = this.INFO.address;
        this.description = this.INFO.p;
      }
    },
  },
});
</script>

<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="img">
        <input
          type="file"
          ref="files"
          id="file"
          multiple
          accept="image/*"
          v-on:change="handleFilesUpload"
        />
        <label for="file">
          <div class="line"><img src="../assets/img_add.png" alt="" /></div>
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
                <img :src="`/assets/` + slide" alt="" />
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
      <div class="info">
        <input v-model="name" type="text" placeholder="имя" />
        <input v-model="phone" type="text" placeholder="номер телефона" />
        <input
          v-model="description"
          type="text"
          placeholder="описание услуги"
        />
      </div>
      <!-- <div class="body">
        <textarea
          v-model="description"
          placeholder="Описание"
          name=""
          id=""
        ></textarea>
      </div> -->
      <div class="reviews"></div>
      <div class="button-wrapper">
        <button class="publish" v-if="!edit" @click="submitFiles">
          Опубликовать
        </button>
        <button class="" v-if="edit" @click="editCard">Сохранить</button>
      </div>
    </div>
  </div>
  <div v-if="error" class="notification-container">
    <div :class="{ error: status == 400, success: status == 200 }">
      <span>{{ error }}</span>
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
  margin-top: 7px;
}
.info_open {
  position: absolute;
  top: 0%;
  min-width: 310px;
  width: 80%;
  min-height: 288px;
  height: 65vh;
  background: linear-gradient(45deg, #f2f2f2, #fff);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: 1px solid #fff;
  border-radius: 15px;
  padding: 10px 20px;
  z-index: 20;
  display: grid;
  overflow-x: hidden;
  overflow-y: scroll;
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

.info_open input {
  border: 1px solid black;
  color: black;
}

.info_open .group {
  font-weight: 500;
  color: black;
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

@media (max-width: 426px) {
  label {
    height: 200px !important;
  }
}
.imgCross {
  position: relative;
}
.cross {
  color: red;
  z-index: 20;
  width: 20px;
  background: transparent;
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

.cross:hover {
  transform: scale(1.4);
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
input::placeholder {
  color: #fff;
}
textarea::placeholder {
  color: #fff;
}

input {
  color: #fff;
  transition: all 500ms ease;
}

input:active,
input:focus,
input:hover {
  box-shadow: 0 0 10px 0 black;
  border: none;
  outline: none;
}

textarea {
  height: 100%;
  background: transparent;
  border: 1px solid var(--mainColor);
  padding: 5px;
  border-radius: 10px;
  color: #fff;
}
.info {
  gap: 10px;
}
.body {
  margin-top: 10px;
}
input {
  background: transparent;
  border: 1px solid var(--mainColor);
  border-radius: 10px;
  padding: 0 35px 0 5px;
  width: 100%;
  height: 50px;
}
input:nth-child(2) {
  width: 95%;
  height: 40px;
}

input:nth-child(3) {
  width: 90%;
  height: 40px;
}

input:nth-child(4) {
  width: 85%;
  height: 40px;
}

input:nth-child(5) {
  width: 80%;
  height: 40px;
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
  min-height: 50px !important;
}

.line img {
  width: 50px !important;
  height: 50px !important;
}

.carousel {
  height: 100%;
}
@media (max-width: 426px) {
  .info {
    width: 100% !important;
  }
  .img {
    width: 100% !important;
  }
}

.img {
  width: 50%;
  height: auto;
  float: left;
  position: relative;
  min-height: 50px !important;
}
.card-wrapper {
  width: 80%;
  color: var(--mainColor);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  min-height: 400px;
}

.info {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
}
.info span {
  font-size: 2rem;
  display: block;
}
.price {
  font-size: 1.5rem !important ;
}
.card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  background: transparent;
  border: none;
  min-height: 400px;
}
.carousel__slide {
  width: 100% !important;
}
img {
  width: 100%;
  border-radius: 5px;
  height: 200px !important;
  object-fit: cover;
}
.title {
  font-size: 20px;
}
.price {
  font-size: 15px;
}
.description {
  margin-top: 10px;
}
.body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.button-wrapper {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 15px;
}

.btn-info {
  background: linear-gradient(45deg, #09203f, #537895);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  border: none;
  color: #fff;
}

button {
  border: none;
  box-shadow: none;
}

button:active {
  box-shadow: none;
}

@media (max-width: 990px) {
  .info_open {
    height: 68vh;
  }
}

@media (max-width: 771px) {
  .info_open {
    width: 95%;
  }

  .card-wrapper {
    width: 100%;
    height: 65vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}

@media (max-width: 566px) {
  .img {
    width: 100%;
    min-height: 200px;
  }
}

@media (max-width: 450px) {
  .info {
    width: 100%;
  }
}

@media (max-height: 780px) {
  .card-wrapper {
    width: 100%;
    height: 70vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .info_open {
    height: 70vh;
  }
}
</style>

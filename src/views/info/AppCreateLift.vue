<script>
import axios from "axios";

export default {
  data() {
    return {
      title: ``,
      geo: "",
      lifting_time: ``,
      phone: ``,
      price: null,
      working_hours_start: ``,
      working_hours_finish: "",
      status: ``,
      error: ``,
      INFO: {},
      edit: false,
      message: "",
      show: false,
    };
  },
  methods: {
    async create() {
      let response = await axios.post(`/create_lift`, {
        title: this.title,
        geo: this.geo,
        lifting_time: this.lifting_time,
        phone: this.phone,
        price: this.price,
        working_hours_start: this.working_hours_start,
        working_hours_finish: this.working_hours_finish,
      });
      this.show = response.data.show;
      this.message = response.data.message;
      this.status = response.data.status;
      setTimeout(() => {
        this.show = false;
        this.message = "";
        this.$router.push({ name: `lift` });
      }, 2000);
    },
    showMessage(message) {
      this.message = message;
      this.show = true;
    },
  },
  mounted() {},
};
</script>

<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="info">
        <div class="group-input">
          <div class="text">Название подъёмника:</div>
          <input v-model="title" type="text" />
        </div>
        <div class="group-input">
          <div class="text">Местоположение:</div>
          <input v-model="geo" type="text" />
        </div>
        <div class="group-input">
          <div class="text">Номер телефона:</div>
          <input v-model="phone" type="tel" />
        </div>
        <div class="group-input">
          <div class="text">Цена:</div>
          <input v-model="price" type="number" />
        </div>
        <div class="group-input">
          <div class="text">Время начало работы:</div>
          <input v-model="working_hours_start" type="time" />
        </div>
        <div class="group-input">
          <div class="text">Время конца работы:</div>
          <input v-model="working_hours_finish" type="time" />
        </div>
        <div class="group-input">
          <div class="text">Время подъёма:</div>
          <input v-model="lifting_time" type="text" />
        </div>
      </div>
      <div class="button-wrapper">
        <button class="publish" v-if="!edit" @click="create">
          Опубликовать
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-wrapper button {
  padding: 5px 15px;
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
textarea {
  height: 100%;
  background: transparent;
  border: 1px solid var(--mainColor);
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
  color: #fff;

  transition: all 500ms;
}

input:active,
input:focus,
input:hover {
  box-shadow: 0 0 10px 0 black;
  border: none;
  outline: none;
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
}
.line {
  position: absolute;
  transform: rotate(0deg) !important;
  width: 20% !important;
}
.line:last-child {
  transform: rotate(90deg) !important;
  display: block;
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
  justify-content: center;
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
  align-items: flex-end;
}

button:active {
  box-shadow: none;
}

.group-input {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.text {
  width: 50%;
  text-align: end;
  font-weight: 600;

  transition: color 400ms;
}

.group-input input {
  width: 50%;
}

input {
  color-scheme: dark;
  box-shadow: 0px 0 10px 0 #ffffff71;
}

.text:hover {
  color: black;
}

@media (max-width: 1010px) {
  .text {
    font-size: small;
  }

  .info {
    width: 90%;
  }
}

@media (max-width: 600px) {
  input {
    padding: 2px 4px;
  }
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      number: "+7",
      id: "",
      error: "",
      status: "",
      places: 1,
      brone: [],
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.number ? this.number.replace(/[^+\d]/g, "") : "";
    },
  },
  methods: {
    updateValue(e) {
      let input = e.target.value.replace(/[^+\d]/g, "");
      if (input.length > 12) {
        input = input.slice(0, 12);
      }
      if (!input.startsWith("+")) {
        input = "+";
      }
      this.number = input;
      e.target.value = this.formatPhoneNumber;
    },
    async booking() {
      let id = this.$route.query.cardID;
      let name = this.$route.query.name;
      // if (name == "transfer") {
      //   let response = await axios.post(`/transfer`, {
      //     book: true,
      //     id: id,
      //     places: this.places,
      //   });
      // } else if (name == "habitation") {
      //   let response = await axios.post(`/`);
      // }
      let response = await axios.post(`/request_brone`, {
        create: true,
        brone: this.brone,
        cardID: id,
        name: name,
        username: this.username,
        number: this.number,
        places: this.places,
        clientID: this.getCookieValue("id"),
      });
      this.error = response.data.message;
      this.status = response.data.status;
      setTimeout(() => {
        this.error = "";
        this.status = "";
        this.$router.go(-1);
      }, 5000);
    },

    async loadInfo() {
      this.id = this.getCookieValue("id");
      let response = await axios.post(`/profile`, { id: this.id });
      let user = response.data.user;
      this.number = user.phone;
      this.username = user.username;
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
    this.brone = this.$store.getters.brone;
    this.loadInfo();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="form-box">
      <h2 class="title">Бронирование</h2>
      <div class="input-box">
        <input v-model="username" type="text" required id="name" />
        <label for="name" class="name">Имя</label>
      </div>
      <div class="input-box">
        <input
          v-model="number"
          @input="updateValue($event)"
          type="tel"
          size="20"
          maxlength="12"
          required
          id="number"
        />
        <label for="number" class="number">Номер телефона</label>
      </div>
      <div class="input-box">
        <input v-model="places" type="number" required id="places" />
        <label for="places" class="places">Количество мест</label>
      </div>
      <div class="group mb-3">
        <button @click="booking" class="sign-up-btn">Забронировать</button>
      </div>
    </div>
    <div v-if="error" class="notification-container">
      <div :class="{ error: status == 400, success: status == 200 }">
        <span>{{ error }}</span>
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
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70vh;
}

.group a {
  width: 100%;
}

.text {
  font-size: small;
  text-align: center;
}

.form-box,
.wrapper-for-register {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #d5d5d5;
  border: 1px solid #d5d5d5;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 0 10px 0 #ffffff71;
  flex-basis: 300px;
}

a {
  color: #d5d5d5 !important;
  text-decoration: none;
}
.input-box {
  position: relative;
  margin: 12px 0;
  width: 100%;
  border-bottom: 2px solid #b3b3b3bc;
}

.call {
  padding: 3px 5px;
  width: fit-content;
  border: 1px solid #d5d5d5;
  background: transparent;
  border-radius: 7px;
  color: #d5d5d5;
}

.input-box input {
  position: relative;
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  border-radius: 10px;
  outline: none;
  font-size: 16px;
  padding: 0 35px 0 5px;
  color: #fff;
}

input:focus ~ label,
input[type="email"]:focus ~ label,
input:valid ~ label {
  top: 0px;
}

.input-box label {
  /* color: #fff; */
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s;
}

.title {
  text-align: center;
}

.sign-up {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 10px;
}

.node {
  color: black;
}

.sign-up-btn {
  background-color: transparent;
  border: 1px solid #d5d5d5;
  color: #d5d5d5;
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 5px 7px;
}

@media (max-height: 760px) {
  .form-box {
    flex-basis: 90%;
  }

  .input-box input {
    height: 30px;
  }

  .form-box {
    margin: 15px 0;
  }

  input:focus ~ label,
  input[type="email"]:focus ~ label,
  input:valid ~ label {
    top: -7px;
  }
}
</style>

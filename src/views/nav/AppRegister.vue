<script>
import { RouterLink } from "vue-router";
import axios from "axios";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      username: "",
      surname: "",
      email: "",
      number: "+7",
      password: "",
      passType: "password",
      error: "",
      status: 0,
      code: "",
      confirmation: false,
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.number ? this.number.replace(/[^+\d]/g, "") : "";
    },
  },
  methods: {
    async submit() {
      let error = await axios.post(`/registration`, {
        username: this.username,
        surname: this.surname,
        email: this.email,
        number: this.number,
        password: this.password,
      });
      this.error = error.data.message;
      this.status = error.data.status;
      setTimeout(() => {
        if (this.status == "200") {
          document.cookie = new String();
          document.cookie = `token=${this.token}; max-age=1123200`;

          this.$router.push({ name: "login" });
        }
      }, 1000);
      setTimeout(() => {
        (this.error = ``), (this.status = ``);
      }, 30000000);
    },

    toconfirm() {
      this.confirmation = true;
    },

    async call() {
      let response = await axios.post(`/confirmation`, {
        phone: this.number,
      });
      this.error = response.data.message;
      this.status = response.data.status;
      setTimeout(() => {
        (this.error = ``), (this.status = ``);
      }, 5000);
    },

    async check() {
      let response = await axios.post(`/confirmation`, {
        codeInput: this.code,
      });
      this.verified = response.data.verified;
      if (this.verified) {
        this.confirmation = false;
        this.status = 200;
        this.error = "Верификация прошла успешно";
        this.submit();
      } else {
        this.status = 400;
        this.error = "Введенный код не совпадает с правильным";
      }
    },

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
  },
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <div v-if="!confirmation" class="form-box">
      <h2 class="title">Регистрация</h2>
      <div class="input-box">
        <input v-model="username" type="text" required id="name" />
        <label for="name" class="name">Имя</label>
      </div>
      <div class="input-box">
        <input v-model="surname" type="text" required id="surname" />
        <label for="surname" class="surname">Фамилия</label>
      </div>
      <div class="input-box">
        <input v-model="email" type="email" required id="emailInput" />
        <label for="emailInput" class="">Почта</label>
      </div>
      <div class="input-box">
        <input
          :value="formatPhoneNumber"
          @input="updateValue($event)"
          type="tel"
          size="20"
          maxlength="12"
          required
          id="number"
        />
        <label for="number" class="number">Номер телефона</label>
      </div>
      <div class="input-box pas">
        <input
          v-model="password"
          name="password"
          :type="passType"
          class="password"
          required
        />
        <label for="">Пароль</label>
        <img
          v-if="passType == 'text'"
          class="show"
          src="@/assets/show.png"
          alt=""
          @click="this.passType = 'password'"
        />
        <img
          v-if="passType == 'password'"
          class="show"
          src="@/assets/hidden.png"
          alt=""
          @click="this.passType = 'text'"
        />
      </div>
      <div class="group mb-3">
        <RouterLink to="/login" class="node">ВХОД</RouterLink>
      </div>
      <div class="sign-up">
        <button @click="toconfirm" class="sign-up-btn" id="sign-up">
          Зарегистрировать
        </button>
      </div>
      <div class="email_check"></div>
    </div>
    <div class="wrapper-for-register" v-if="confirmation">
      <h2 class="title">Подтверждение</h2>
      <div class="text">
        Для подтверждения номера телефона введите последние 4 цифры номера,
        который позвонит на ваш указанный номер
      </div>
      <div class="input-box">
        <input v-model="code" type="text" required id="code" />
        <label for="code" class="name">Последние 4 цифры</label>
      </div>
      <div class="group mb-3">
        <RouterLink to="/phone_policy" class="node"
          >Политика соглашения</RouterLink
        >
      </div>
      <div class="sign-up">
        <button @click="call" class="call">Позвонить</button>
        <button @click="check" class="sign-up-btn" id="sign-up">
          Проверить
        </button>
      </div>
      <div class="email_check"></div>
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

.show {
  height: 28px;
  cursor: pointer;
}

.pas {
  display: flex;
  align-items: center;
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
